module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      emcc_pre: {
        src: ['lib/pre_*.js'],
        options: {
          // Allow object['name'] for closure minification in emscripten.
          sub: true
        }
      },
      lib: ['lib/*.js', '!lib/pre_*.js']
    },
    shell: {
      submodules: {
        options: {
          callback: function(err, stdout, stderr, fn) {
            grunt.log.writeln('Submodules up to date.');
            // The current version of grunt-shell calls the async callback no
            // matter what and grunt doesn't like it being called twice.
            // fn(err);
          }
        },
        command: 'git submodule init && git submodule update'
      },
      make: {
        options: {
          stdout: true,
          callback: function(err, stdout, stderr, fn) {
            // The current version of grunt-shell calls the async callback no
            // matter what and grunt doesn't like it being called twice.
            // fn(err);
          }
        },
        command: 'make'
      }
    },
    testem: {},
    webpack: {
      client: {
        entry: './lib/client.js',
        output: {
          path: 'dist/',
          filename: 'gifsicle.client.js'
        }
      },
      worker: {
        entry: './lib/worker.js',
        output: {
          path: 'dist/',
          filename: 'gifsicle.worker.js'
        },
        module: {
          noParse: /gifsicle.js$/
        },
        target: 'webworker',
        node: {
          process: false,
          global: false,
          buffer: false,
          __filename: false,
          __dirname: false
        }
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-commands');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-testem');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['shell:submodules', 'shell:make', 'webpack']);
  grunt.registerTask('test', ['jshint', 'testem']);
};