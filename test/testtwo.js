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
    .yield().then(done)
    .otherwise(done);
});
