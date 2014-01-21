var _ = require('underscore');
var gifsicleraw = require('../vendor/gifsicle/src/gifsicle.js');

var GlobalOptions = [];
var Options = [ 'delay', 'colors' ];

function Gifsicle() {
  this.globalOptions = {};
  this.options = {};
  this.frames = [];
}

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
    _.extend( _gifsicle.options, msg.options );
  } else if (msg.method === 'add') {
    var array = msg.data;

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
  } else if (msg.method === 'run') {
    var args = ['--output', '/tmp/gif/out.gif'];

    gifsicleraw.FS.writeFile('/tmp/gif/out.gif', [], {encoding: 'binary'});

    // Encode args array.
    _gifsicle.frames.forEach(function( frame ) {
      _.each(frame.options, function(value, key) {
        args.push('--' + key, value.toString());
      });
      args.push(frame.path);
    });

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
    postMessage(
      { method: 'success', data: outputCopy.buffer },
      [ outputCopy.buffer ]
    );

    _gifsicle = new Gifsicle();
  }
};

postMessage('loaded');
