var utils = require('./utils');

suite('one image');

test('black', function(done) {
  utils.whenImage('image/black.gif')
    // Once the image has loaded.
    .then(utils.assertImageSize(256, 256))
    .then(utils.whenGif)
    // The size that gifsicle run from a terminal generates with black.gif.
    .then(utils.assertBlobSize(384))
    .yield().then(done)
    .otherwise(done);
});

test('white', function(done) {
  utils.whenImage('image/white.gif')
    // Once the image has loaded.
    .then(utils.assertImageSize(256, 256))
    .then(utils.whenGif)
    // The size that gifsicle run from a terminal generates with white.gif.
    .then(utils.assertBlobSize(384))
    .yield().then(done)
    .otherwise(done);
});

test('rainbow', function(done) {
  utils.whenImage('image/rainbow.gif')
    // Once the image has loaded.
    .then(utils.assertImageSize(256, 256))
    .then(utils.whenGif)
    // The size that gifsicle run from a terminal generates with rainbow.gif.
    .then(utils.assertBlobSize(9504))
    .yield().then(done)
    .otherwise(done);
});

test('noise', function(done) {
  utils.whenImage('image/noise.gif')
    // Once the image has loaded.
    .then(utils.assertImageSize(128, 128))
    .then(utils.whenGif)
    // The size that gifsicle run from a terminal generates with noise.gif.
    .then(utils.assertBlobSize(23085))
    .yield().then(done)
    .otherwise(done);
});

test('reuse gifsicle', function(done) {
  var whenGif = utils.whenGifWithGif(gifsicle(gifsicle.worker('../dist/')));

  utils.whenImage('image/black.gif')
    .then(whenGif)
    .then(utils.assertBlobSize(384))
  .yield(utils.whenImage('image/white.gif'))
    .then(whenGif)
    .then(utils.assertBlobSize(384))
    .yield().then(done)
    .otherwise(done);
});
