/*
 * grunt-watch-idle
 * https://github.com/domelaz/grunt-watch-idle
 *
 * Copyright (c) 2015 Anton Domolazov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {});

  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['mochaTest:task']);
};