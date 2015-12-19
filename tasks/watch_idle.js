/**
 * grunt-watch-idle
 * https://github.com/domelaz/grunt-watch-idle
 *
 * Copyright (c) 2015 Anton Domolazov
 * Licensed under the MIT license.
 */

'use strict';

/**
* Under the hood we wrap targets callbacks and timeouts in binded
* `setInterval` functions and store them here.
*/
var timers    = []; // task targets `setInterval` functions
var intervals = []; // corresponding interval objects

module.exports = function(grunt) {
  var taskName = 'watch_idle';
  var taskDescription = 'Make something when nothing happens';
  var envNS = 'GWIDL_'; // environment namespace

  /**
   * Default behavior
   *
   * After fifteen minutes idle, log relaxing message into grunt console.
   * Timeout may be altered by `GWIDL_TIMEOUT` environment variable.
   */
  var defaults = {
    timeout: process.env[envNS + 'TIMEOUT'] || 15 * 60 * 1000,
    action: function() {
      grunt.log.error('You idling, dude!'.green);
    }
  };

  /**
   * This task is not intended to run directly, so not `registerMultiTask`
   * nor `registerInitTask` will never been invoked in ordinary way.
   * It's may be ok for default values, but if we have task config object in
   * Gruntfile, it will be ignored. Let's make configuration here.
   */
  function init() {
    var config = grunt.config(taskName);
    var off, immediate;

    if (config && config.options) {
      off = config.options.off;
      immediate = config.options.immediate;
    }

    // fast way to shut up `watch-idle` without uninstalling it.
    if (process.env[envNS + 'OFF'] || off) { return; }

    if (config) {
      Object.keys(config).forEach(function(target) {
        if (target !== 'options') {
          timers.push(setInterval.bind(config[target],
            config[target].action, config[target].timeout));
        }
      });
    } else {
      // Use defaults if task not configured. Side effect: task always in charge.
      timers.push(setInterval.bind(defaults, defaults.action, defaults.timeout));
    }

    /**
     * This task run only after first emitted `watch` event. `options.immediate`
     * will start timers immediately, but on **any** grunt task, not watch only.
     *
     * `immediate` feature may be handsome, but disabled by default.
     */
    if (immediate) {
      restart(true);
    }

    // grunt restarts task on file changes. Hope we not produce leaks :)
    grunt.event.off('watch', restart);
    grunt.event.on('watch', restart);
  }

  /**
   * Anyway, `registerMultiTask` callback still required for defaults.
   */
  grunt.registerMultiTask(taskName, taskDescription, function() {});

  /**
   * Prolong timeouts of interval objects
   *
   * On `watch` event ("something happens") clear all pending intervals
   * and then start it again. Thus, intervals themselves start shooting
   * only after some period of silince from `grunt-contrib-watch`.
   *
   * @param {string} status Came from `grunt-contrib-watch` event
   */
  function restart(status) {
    intervals.forEach(function(interval, index, collection) {
       clearInterval(interval);
       collection.splice(index, 1);
    });
    if (!status) {
      return;
    }
    timers.forEach(function(fn) {
      var i = fn();
      intervals.push(i);
      i.unref();
    });
  }

  // Let's go?
  init();
};
