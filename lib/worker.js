var _ = require('underscore');
var gifsicleraw = require('../vendor/gifsicle/src/gifsicle.js');

var GlobalOptions = [];
var Options = [ 'delay', 'colors' ];

function Gifsicle() {
  this.globalOptions = {};
  this.options = {};
  this.frames = [];
}

var GlobalOptionNames = Gifsicle.GlobalOptionNames = ['loop'];

Gifsicle.prototype.option = function(options) {
  _.extend(this.globalOptions, _.pick(options, GlobalOptionNames));
  _.extend(this.options, _.omit(options, GlobalOptionNames));
};

Gifsicle.prototype.add = function(data) {
  var array = data;

  // create a file in the fake file system
  var parent = '/tmp/gif';
  var name = _gifsicle.frames.length + '.gif';
  gifsicleraw.FS.writeFile(
    parent + '/' + name,
    new Uint8Array(array),
    {encoding: 'binary'}
  );

  // store frame information
  _gifsicle.frames.push({
    options: _.clone(_gifsicle.options),
    path: parent + '/' + name
  });
};

Gifsicle.prototype._encodeOptions = function(args, options) {
  _.each(options, function(value, key) {
    if (value === true) {
      args.push('--' + key);
    } else {
      args.push('--' + key, value.toString());
    }
  });
};

Gifsicle.prototype.render = function() {
  var args = ['--output', '/tmp/gif/out.gif'];

  gifsicleraw.FS.writeFile('/tmp/gif/out.gif', [], {encoding: 'binary'});

  // Encode args array.
  this._encodeOptions(args, this.globalOptions);
  this.frames.forEach(function( frame ) {
    this._encodeOptions(args, frame.options);
    args.push(frame.path);
  }, this);

  // Run gifsicle.
  gifsicleraw.callMain(args);

  // respond with the written gif
  var stat = gifsicleraw.FS.stat('/tmp/gif/out.gif');
  var output = gifsicleraw.FS.readFile('/tmp/gif/out.gif');
  var errorOutput = gifsicleraw.errorOutput;
  var outputCopy = new Uint8Array(
    // Safari demands arguments for slice.
    output.buffer.slice(0, output.buffer.byteLength)
  );

  return outputCopy;
};

var _gifsicle = new Gifsicle();
try {
  gifsicleraw.FS_createFolder('/', 'tmp', true, true);
} catch (e) {}
try {
  gifsicleraw.FS_createFolder('/tmp', 'gif', true, true);
} catch (e) {}

onmessage = function(e) {
  var msg = e.data;
  if (msg.method === 'option') {
    // update options
    _gifsicle.option(msg.options);
  } else if (msg.method === 'add') {
    _gifsicle.add(msg.data);
  } else if (msg.method === 'run') {
    var outputCopy = _gifsicle.render();

    postMessage(
      { method: 'success', data: outputCopy.buffer },
      [ outputCopy.buffer ]
    );

    _gifsicle = new Gifsicle();
  }
};

postMessage('loaded');
