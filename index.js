
/**
 * Module depedencies.
 */

var debug = require('debug')('jog:std')
  , EventEmitter = require('events').EventEmitter;

/**
 * Expose `StdStore`.
 */

module.exports = StdStore;

/**
 * Initialize a `StdStore`.
 *
 * @api public
 */

function StdStore(options) {
  debug('stdstore');
  options = options || {};
  this.redirect = options.redirect || false;
  this.inStream = options.in || process.stdin;
  this.errStream = options.err || process.stderr;
  this.outStream = options.out || process.stdout;
}

/**
 * Add `obj` to the file.
 *
 * @param {Object} obj
 * @api private
 */

StdStore.prototype.add = function(obj){
  debug('add %j', obj);
  if (!this.redirect && (obj.level === 'error' || obj.level === 'warn')) {
    this.errStream.write(JSON.stringify(obj) + '\n');
  }
  else {
    this.outStream.write(JSON.stringify(obj) + '\n');
  }
};

/**
 * Clear and invoke `fn()`.
 *
 * @param {Function} fn
 * @api private
 */

StdStore.prototype.clear = function(fn){
  debug('clear');
  process.nextTick(fn);
};

/**
 * Return an `EventEmitter` which emits "data"
 * and "end" events.
 *
 * @param {Object} options
 * @return {EventEmitter}
 * @api private
 */

StdStore.prototype.stream = function(options){
  var emitter = options.emitter || new EventEmitter
    , options = options || {}
    , buf = options.buf || ''
    , self = this
    , substr
    , obj
    , i;

  // stream
  var stream = this.inStream;
  stream.resume();
  if (process.stdin === stream) {
    stream.setEncoding('utf8');
  }

  // If this is not stdin, we should emit end after options.interval.
  if (process.stdin !== stream && false !== options.end) {
    setTimeout(function () {
      stream.pause();
      emitter.emit('end');
    }, options.interval);
  }

  stream.on('data', function(chunk){
    buf += chunk
    while (~(i = buf.indexOf('\n'))) {
      substr = buf.slice(0, i);
      if ('' == substr) break;
      // We need to be more lenient with stdin than other stores.
      try {
        obj = JSON.parse(substr);
      }
      catch(e) {
        obj = {type: substr};
      }
      emitter.emit('data', obj);
      buf = buf.slice(i + 1);
    }
  });

  stream.on('end', function(){
    emitter.emit('end');
  });

  return emitter;
};