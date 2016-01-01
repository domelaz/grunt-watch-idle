# grunt-watch-idle

> Make something when nothing happens.

## Getting Started
This plugin requires Grunt `~0.4.5` with `grunt-contrib-watch` plugin.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-watch grunt-watch-idle --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-watch-idle');
```

## The "watch_idle" task

### Overview

"watch_idle" is a multiTask plugin, configuration objects for various targets must contains `timeout` integer  
and `action` callback. If `watch` event not emitted in `timeout` period, `action` will be fired, over and over again.

```js
grunt.initConfig({
  watch_idle: {
    foo: {
      timeout: 60 * 60 * 1000,
      action: function() {
        grunt.log.writeln('foo callback invoked after hour of inactivity');
      }
    },
  },
});
```
When no configuration provided, plugin starts log messages into console on every 15 minutes of idle.

### Options

#### options.off
Type: `Any`  
Default: on

Prevent plugin from loading. `GWIDL_OFF` environment variable also used for this purpose.  
Since plugin loaded automatically, this is a fast way to temporarily disable it.

#### options.immediate
Type: `Any`  
Default: disabled

Targets starts their countdowns only after **first** emitted `watch` event. `immediate` option allow 
start timers immediately, but with **any** grunt task, not `watch` only.

### Usage Examples

Short example with on-screen notifications in Ubuntu.

```js
var spawn = require('child_process').spawn;

module.exports = function(grunt) {
  grunt.initConfig({
    watch_idle: {
      visual: {
        timeout: 10 * 60 * 1000,
        action: function() {
          spawn('/usr/bin/notify-send', [
            '-i', '/usr/share/icons/hicolor/32x32/actions/system-restart.png',
            'Where you commits?',
            'Get up, man!'
          ]);
        }
      },
    },
  });
};
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 2016-01-01   v0.1.0   Happy New Code!