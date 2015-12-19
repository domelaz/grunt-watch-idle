'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var grunt = require('grunt');

var taskFile = '../tasks/watch_idle';
var notifier; // client callback spy
var testTarget = {
  timeout: 500,
  action: function() {
    grunt.log.error(42);
  }
};

describe('grunt-watch-idle task', function() {
  this.slow(5000);
  this.timeout(60000);

  beforeEach(function() {
    delete process.env.GWIDL_TIMEOUT;
    delete process.env.GWIDL_OFF;
    delete require.cache[require.resolve(taskFile)];
    grunt.event.removeAllListeners('watch');

    notifier = sinon.spy(grunt.log, 'error');
  });

  afterEach(function() {
    notifier.restore();
    grunt.event.emit('watch');
  });

  it('`registerMultiTask` callback must exists', function() {
    require(taskFile)(grunt);
    /*jshint -W030 */
    expect(grunt.task.run('watch_idle')).to.not.throw;
  });

  it('Simple `watch` event makes no sense', function() {
    require(taskFile)(grunt);
    grunt.event.emit('watch', true);
    /*jshint -W030 */
    expect(notifier).to.have.not.called;
  });

  it('Notifier must shoot only after TIMEOUT', function(done) {
    process.env.GWIDL_TIMEOUT = 500;
    require(taskFile)(grunt);
    grunt.event.emit('watch', true);
    setTimeout(function() {
      /*jshint -W030 */
      expect(notifier).to.have.been.calledOnce;
      done();
    }, 750);
  });

  it('Continious `watch` which fits in TIMEOUT delays notifier', function(done) {
    process.env.GWIDL_TIMEOUT = 300;
    require(taskFile)(grunt);

    setTimeout(function() {
      /*jshint -W030 */
      expect(notifier).to.have.not.called;
      done();
    }, 800);

    setTimeout(function() { grunt.event.emit('watch', true); }, 200);
    setTimeout(function() { grunt.event.emit('watch', true); }, 400);
    setTimeout(function() { grunt.event.emit('watch', true); }, 600);
  });

  it('Disable task with `GWIDL_OFF` environment var', function(done) {
    process.env.GWIDL_OFF = 'true';
    grunt.config.init({
      'watch_idle': {
        options: { immediate: null, off: null },
        test: testTarget
      }
    });
    require(taskFile)(grunt);

    setTimeout(function() {
      /*jshint -W030 */
      expect(notifier).to.have.not.called;
      done();
    }, 600);

    grunt.event.emit('watch', true);
  });

  it('Disable task from config with `off` option', function(done) {
    grunt.config.init({
      'watch_idle': {
        options: { off: true },
        test: testTarget
      }
    });
    require(taskFile)(grunt);

    setTimeout(function() {
      /*jshint -W030 */
      expect(notifier).to.have.not.called;
      done();
    }, 600);

    grunt.event.emit('watch', true);
  });

  it('Target Gruntfile.js config with `immediate` option', function(done) {
    grunt.config.init({
      'watch_idle': {
        options: { immediate: true },
        test: testTarget
      }
    });
    require(taskFile)(grunt);
    // `options.immediate` must trigger notifier without `watch` event:
    // grunt.event.emit('watch', true);
    setTimeout(function() {
      expect(notifier).to.have.been.calledWith(42);
      done();
    }, 600);
  });
});
