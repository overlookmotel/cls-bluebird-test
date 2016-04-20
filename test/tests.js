// --------------------
// cls-bluebird-test module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
    loseContext = require('lose-cls-context');

/* jshint expr: true */
/* global describe, it */

module.exports = function(Promise, ns) {
	describe('maintains context in', function() {
		it('promise constructor', function(cb) {
			parallel(function(i) {
				return runInContext(i, function() {
					return new Promise(function(resolve) {
						expect(ns.get('test')).to.equal(i);
						resolve();
					});
				});
			}, cb);
		});

		describe('then', function() {
			describe('attached to', function() {
				it('pending promise', function(cb) {
			        parallel(function(i) {
						return runInContext(i, function() {
			                return Promise.resolve().then(function() {}).then(function() {
			                    expect(ns.get('test')).to.equal(i);
			                });
			            });
			        }, cb);
			    });

				it('fulfilled promise', function(cb) {
			        parallel(function(i) {
						return runInContext(i, function() {
			                return Promise.resolve().then(function() {
			                    expect(ns.get('test')).to.equal(i);
			                });
			            });
			        }, cb);
			    });
			});

			describe('attached outside ns scope to', function() {
				it('pending promise', function(cb) {
			        parallel(function(i) {
			            return runInContext(i, function() {
			                return Promise.resolve().then(function() {});
			            }).then(function() {
			                expect(ns.get('test')).to.equal(i);
			            });
			        }, cb);
			    });

				it('fulfilled promise', function(cb) {
			        parallel(function(i) {
			            return runInContext(i, function() {
			                return Promise.resolve();
			            }).then(function() {
			                expect(ns.get('test')).to.equal(i);
			            });
			        }, cb);
			    });
			});

			describe('after context lost', function() {
				it('in promise creation', function(cb) {
			        parallel(function(i) {
			            return runInContext(i, function() {
			                return promiseLoseContext().then(function() {
			                    expect(ns.get('test')).to.equal(i);
			                });
			            });
			        }, cb);
			    });

			    it('in promise chain', function(cb) {
			        parallel(function(i) {
			            return runInContext(i, function() {
			                return Promise.resolve().then(function() {}).then(function() {
								expect(ns.get('test')).to.equal(i);
								return promiseLoseContext();
			                }).then(function() {
			                    expect(ns.get('test')).to.equal(i);
			                });
			            });
			        }, cb);
			    });
			});
		});
	});

	/*
	 * runInContext
	 * Creates a CLS context (`ns.run()`) and runs fn within it
	 *
	 * @param {Number} i - Value to set on CLS context
	 * @param {Function} fn - Function to be run within CLS context
	 * @returns {<Any>} result - value returned by fn()
	 */
	function runInContext(i, fn) {
		var result;
		ns.run(function() {
			ns.set('test', i);
			result = fn(i);
		});
		return result;
	}

	/*
	 * promiseLoseContext
	 * returns a Promise with CLS context lost before promise resolves
	 * @returns {Promise}
	 */
	function promiseLoseContext() {
		return new Promise(function(resolve) {
			loseContext(resolve);
		});
	}

	/*
	 * parallel
	 * Runs test function multiple times in parallel.
	 * Calls callback with no args if test function did not throw at all.
	 * Calls callback with 'Always fails' error if test function throws every time.
	 * Calls callback with 'Sometimes fails' error if test function throws at least once but not always..
	 *
	 * @param {Function} fn - test function which contains the test
	 * @param {Function} cb - callback function called at end
	 * @returns {undefined}
	 */
    function parallel(fn, cb) {
		var iterations = 3;
		var promises = [], done = 0, success = 0;

        for (var i = 0; i < iterations; i++) {
            promises[i] = fn(i).then(function() {
				success++;
				finished();
			}, function() {
				finished();
			});
        }

		function finished() {
			done++;
			if (done < iterations) return;
			if (success == iterations) return cb();
			if (success == 0) return cb(new Error('Always fails'));
			return cb(new Error('Sometimes fails'));
		}
    }
};
