module.exports = window.gifsicle = gifsicle;

function gifsicle( worker ) {
  return new Gifsicle( worker );
}

gifsicle.worker = function worker() {
  return new Worker('gifsicle.worker.js');
};

function Gifsicle( worker ) {
  this.worker = worker || gifsicle.worker();
}

//
// Define options for the following frames.
//
// @param {Object} options to extend any previously set options.
// @return {null}
Gifsicle.prototype.option = function( opt ) {
  this.worker.postMessage({method: 'option', options: opt});
};

//
// Add an Canvas to the stream of images.
//
// @param {Canvas} canvas to copy for a frame of this new GIF.
// @return {null}
Gifsicle.prototype.add = function( data ) {
  if ( data instanceof Canvas ) {
    data = data.toBlob('image/gif');
  }
  this.worker.postMessage({method: 'add', data: data}, [data]);
};

//
// Run gifsicle and callback when done.
//
// @param {function(Blob)} function given a Blob holding the generated GIF.
// @return {null}
Gifsicle.prototype.run = function( fn ) {
  this.worker.onmessage = function( e ) {
    fn( e.data );
  };
  this.worker.postMessage({method: 'run'});
};
