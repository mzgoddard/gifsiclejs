//
// Utility functions for testing.

var assert = require('chai').assert;
var when = require('when');

var utils = module.exports = {};

// Create a when promise yielding an Image element with the given src.
utils.whenImage = function(src) {
  var img = new Image();

  var imgDefer = when.defer();
  img.onload = imgDefer.resolve;
  img.onerror = imgDefer.reject;
  img.src = src;

  return imgDefer.promise
    // Instead of handling the load event, yield the img object.
    .yield(img);
};

utils.whenGifWithGif = function(_gif) {
  return function(img) {
    // If a gifsicle was defined, reuse that. If not, create a new one
    // each time.
    var gif = _gif;
    if (!gif) {
      var worker = gifsicle.worker('../dist/');
      gif = gifsicle(worker);
    }

    // Add the image(s) to gifsicle and start.
    if (Array.isArray(img)) {
      for (var i = 0; i < img.length; i++) {
        gif.add(img[i]);
      }
    } else {
      gif.add(img);
    }
    var whenGif = when.defer();
    gif.render(whenGif.resolve);

    // Perform the next step when gifsicle returns.
    return whenGif.promise;
  };
};

// Create a when promise that runs gifsicle on a single or set of images.
utils.whenGif = utils.whenGifWithGif();

// Create a function that will test an image's width and height against
// these values.
utils.assertImageSize = function(w, h) {
  return function(img) {
    // Confirm that it is the correct size.
    assert.equal(img.width, w);
    assert.equal(img.height, h);
    return img;
  };
};

// Create a function that will assert that a given blob is the correct size.
utils.assertBlobSize = function(size) {
  return function(blob) {
    assert.ok(blob instanceof Blob);
    assert.equal(blob.size, size);
    return blob;
  };
};
