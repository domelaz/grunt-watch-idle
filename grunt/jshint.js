'use strict';

module.exports = {
  options: {
    jshintrc: true
  },
  grunt: {
    src: ['Gruntfile.js', 'grunt/**/*.js']
  },
  task: {
    src: ['tasks/**/*.js']
  },
  test: {
    src: ['test/**/*.js']
  },
};
