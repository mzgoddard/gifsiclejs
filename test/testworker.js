var assert = require('chai').assert;

suite('worker');

test('boot', function(done) {
  var worker = gifsicle.worker('../dist/');
  worker.onmessage = function(e) {
    try {
      assert.ok(e.data === 'loaded');
      done();
    } catch (e) {
      done(e);
    }
  };
});
