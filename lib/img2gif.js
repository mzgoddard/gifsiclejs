var GIF = require('gif.js/dist/gif').GIF;

var img2gif = module.exports = function(data, fn) {
  var _gifjs = new GIF({workerScript: img2gif.root + 'gif.worker.js'});
  _gifjs.addFrame(data);
  _gifjs.on('finished', function(blob) {
    var reader = new FileReader();
    reader.onloadend = function(e) {
      fn(reader.result);
    };
    reader.onerror = function() { console.error('error', arguments); };
    reader.readAsArrayBuffer(blob);
  });
  _gifjs.render();
};

img2gif.root = '.';
