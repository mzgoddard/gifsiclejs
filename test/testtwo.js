var when = require('when');

var utils = require('./utils');

suite('two images');

test('black/white', function(done) {
  when.all([
    utils.whenImage('image/black.gif').then(utils.assertImageSize(256, 256)),
    utils.whenImage('image/white.gif').then(utils.assertImageSize(256, 256))
  ])
    .then(utils.whenGif)
    .then(utils.assertBlobSize(748))
    .then(utils.assertBlobCRC32('5bd65508'))
    .yield().then(done)
    .otherwise(done);
});

test('black/white loop', function(done) {
  var gif = gifsicle(gifsicle.worker('../dist/'));
  var whenGif = utils.whenGifWithGif(gif);

  gif.option({'loop': true});

  when.all([
    utils.whenImage('image/black.gif').then(utils.assertImageSize(256, 256)),
    utils.whenImage('image/white.gif').then(utils.assertImageSize(256, 256))
  ])
    .then(whenGif)
    .then(utils.assertBlobSize(767))
    .then(utils.assertBlobCRC32('7f3fe48d'))
    .yield().then(done)
    .otherwise(done);
});
