// Included at the start of the gifsicle emscripten output.
var output = [];
var Module = {};
Module['noInitialRun'] = true;
Module['output'] = output;
Module['stdout'] = function(c) {
  output.push(c);
};
