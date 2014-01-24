var when = require('when');

var utils = require('./utils');

suite('n images');

test('all', function(done) {
  var gif = gifsicle(gifsicle.worker('../dist/'));
  var whenGif = utils.whenGifWithGif(gif);

  gif.option({'colors': 256});

  when.all([
    utils.whenImage('image/black.gif').then(utils.assertImageSize(256, 256)),
    utils.whenImage('image/white.gif').then(utils.assertImageSize(256, 256)),
    utils.whenImage('image/rainbow.gif').then(utils.assertImageSize(256, 256))
  ])
    .then(function(images) {
      var black = images[0], white = images[1], rainbow = images[2];
      return [
        black, white, rainbow, white, black, white, rainbow, white, black
      ];
    })
    .then(whenGif)
    .then(utils.assertBlobSize(20774))
    // TODO: File size checks with native gifsicle. CRC32 doesn't. Weird.
    // .then(utils.assertBlobCRC32('b0bcece8'))
    .yield().then(done)
    .otherwise(done);
});

test('all loop', function(done) {
  var gif = gifsicle(gifsicle.worker('../dist/'));
  var whenGif = utils.whenGifWithGif(gif);

  gif.option({'loop': true, 'colors': 256});

  when.all([
    utils.whenImage('image/black.gif').then(utils.assertImageSize(256, 256)),
    utils.whenImage('image/white.gif').then(utils.assertImageSize(256, 256)),
    utils.whenImage('image/rainbow.gif').then(utils.assertImageSize(256, 256))
  ])
    .then(function(images) {
      var black = images[0], white = images[1], rainbow = images[2];
      return [
        black, white, rainbow, white, black, white, rainbow, white, black
      ];
    })
    .then(whenGif)
    .then(utils.assertBlobSize(20793))
    // TODO: File size checks with native gifsicle. CRC32 doesn't. Weird.
    // .then(utils.assertBlobCRC32('d9057afe'))
    .yield().then(done)
    .otherwise(done);
});
