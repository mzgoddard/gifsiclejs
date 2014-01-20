var _ = require('lodash');
var gifsicleraw = require('../vendor/gifsicle/src/gifsicle.js');

var GlobalOptions = [];
var Options = [ 'delay', 'colors' ];

function Gifsicle() {
  this.globalOptions = {};
  this.options = {};
  this.frames = [];
}

var _gifsicle = new Gifsicle();

worker.onmessage = function(e) {
  var msg = e.data;
  if (msg.method === 'option') {
    // update options
    _.extend( _gifsicle.options, msg.options );
  } else if (msg.method === 'add') {
    // translate msg.data to array
    var reader = new FileReaderSync();
    var array = reader.readAsArrayBuffer(msg.data);

    // create a file in the fake file system
    var parent = '/tmp/gif';
    var name = _gifsicle.frames.length + '.gif';
    gifsicleraw.FS_createDataFile(parent, name, data, true, true, true);

    // store frame information
    _gifsicle.frames.push({
      options: _.clone(_gifsicle.options),
      path: parent + '/' + name
    });
  } else if (msg.method === 'run') {
    var args = [];

    // Encode args array.
    _gifsicle.frames.forEach(function( frame ) {
      _.each(frame.options, function(value, key) {
        args.push('--' + key, value.toString());
      });
    });
    gifsicleraw.run(args);

    // respond with the written gif
    var output = gifsicleraw.output;
    var blob = new Blob([output]);
    postMessage({method: 'success', data: blob}, [blob]);
  }
};
