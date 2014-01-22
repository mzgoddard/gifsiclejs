var img2gif = require('./img2gif');

module.exports = window.gifsicle = gifsicle;

function gifsicle( worker ) {
  return new Gifsicle( worker );
}

gifsicle.worker = function worker(root) {
  return new Worker((root || '') + 'gifsicle.worker.js');
};

gifsicle.img2gif = img2gif;

function Gifsicle( worker ) {
  this.worker = worker || gifsicle.worker();
  this.queue = [];
}

//
// Define options for the following frames.
//
// @param {Object} options to extend any previously set options.
// @return {null}
Gifsicle.prototype.option = function( opt ) {
  this._queue(function() {
    this.worker.postMessage({method: 'option', options: opt});
    this._stepQueue();
  });
};

//
// Add an Canvas to the stream of images.
//
// @param {Canvas} canvas to copy for a frame of this new GIF.
// @return {null}
Gifsicle.prototype.add = function( data ) {
  this._queue(function() {
    var post = function() {
      this.worker.postMessage(
        { method: 'add', data: data },
        [ data ]
      );
      this._stepQueue();
    };

    if (data.src && /\.gif$|^data:image\/gif/.test(data.src)) {
      // Load the src and use it directly as the binary.
      var xhr = new XMLHttpRequest();
      xhr.open('GET', data.src);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        data = xhr.response;
        post.call(this);
      }.bind(this);
      xhr.send();
    } else {
      // Use gif.js to translate the given content to a gif.
      img2gif(data, function(result) {
          data = result;
          post.call(this);
      }.bind(this));
    }
  });
};

//
// Run gifsicle and callback when done.
//
// @param {function(Blob)} function given a Blob holding the generated GIF.
// @return {null}
Gifsicle.prototype.render = function( fn ) {
  this._queue(function() {
    this.worker.onmessage = function(e) {
      if (e.data !== 'loaded') {
        console.dir(new Uint8Array(e.data.data));
        fn(new Blob(new Array(e.data.data)));
        this._stepQueue();
      }
    }.bind(this);

    this.worker.postMessage({method: 'run'});
  });
};

Gifsicle.prototype._queue = function(fn) {
  this.queue.push(fn);
  if (this.queue[0] === fn) {
    this.queue[0].call(this);
  }
};

Gifsicle.prototype._stepQueue = function() {
  this.queue.shift();
  if (this.queue.length > 0) {
    this.queue[0].call(this);
  }
};
