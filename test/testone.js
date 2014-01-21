var assert = require('chai').assert;
var when = require('when');

var whenImage = function(src) {
  var img = new Image();

  var imgDefer = when.defer();
  img.onload = imgDefer.resolve;
  img.onerror = imgDefer.reject;
  img.src = src;

  return imgDefer.promise
    // Instead of handling the load event, yield the img object.
    .yield(img);
};

var whenGif = function(img) {
  var worker = gifsicle.worker('../dist/');
  var gif = gifsicle(worker);

  // Add the image to gifsicle and start.
  gif.add(img);
  var whenGif = when.defer();
  gif.render(whenGif.resolve);

  // Perform the next step when gifsicle returns.
  return whenGif.promise;
};

var assertImageSize = function(w, h) {
  return function(img) {
    // Confirm that it is the correct size.
    assert.equal(img.width, w);
    assert.equal(img.height, h);
    return img;
  };
};

var assertBlobSize = function(size) {
  return function(blob) {
    assert.ok(blob instanceof Blob);
    assert.equal(blob.size, size);
    return blob;
  };
};

suite('one image');

test('black', function(done) {
  whenImage('image/black.gif')
    // Once the image has loaded.
    .then(assertImageSize(256, 256))
    .then(whenGif)
    // The size that gifsicle run from a terminal generates with black.gif.
    .then(assertBlobSize(384))
    .yield().then(done)
    .otherwise(done);
});

test('white', function(done) {
  whenImage('image/white.gif')
    // Once the image has loaded.
    .then(assertImageSize(256, 256))
    .then(whenGif)
    // The size that gifsicle run from a terminal generates with white.gif.
    .then(assertBlobSize(384))
    .yield().then(done)
    .otherwise(done);
});

test('rainbow', function(done) {
  whenImage('image/rainbow.gif')
    // Once the image has loaded.
    .then(assertImageSize(256, 256))
    .then(whenGif)
    // The size that gifsicle run from a terminal generates with rainbow.gif.
    .then(assertBlobSize(9504))
    .yield().then(done)
    .otherwise(done);
});

test('noise', function(done) {
  whenImage('image/noise.gif')
    // Once the image has loaded.
    .then(assertImageSize(128, 128))
    .then(whenGif)
    // The size that gifsicle run from a terminal generates with noise.gif.
    .then(assertBlobSize(23085))
    .yield().then(done)
    .otherwise(done);
});
