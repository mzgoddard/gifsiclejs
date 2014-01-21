// Included at the start of the gifsicle emscripten output.
var output = [];
var errorOutput = [];
var Module = {};

Module['output'] = output;
Module['errorOutput'] = errorOutput;

Module['stdout'] = function(c) {
  output.push(c);
};
Module['stderr'] = function(c) {
  errorOutput.push(c);
};

Module['preRun'] = [function() {
  output.length = 0;
  errorOutput.length = 0;

  Module['print'] = function(s) {
    for (var i = 0; i < s.length; i++) {
      output.push(s.charCodeAt(i));
    }
  };
  Module['printErr'] = function(s) {
    for (var i = 0; i < s.length; i++) {
      errorOutput.push(s.charCodeAt(i));
    }
  };
}];

// Normally emscripten only does this if it detects a node environment.
module['exports'] = Module;
