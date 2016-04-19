// --------------------
// cls-bluebird-test module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
    loseContext = require('lose-cls-context');

/* jshint expr: true */
/* global it */

module.exports = function(Promise, ns) {
    it('maintains context', function(cb) {
        run(function(i) {
            var promise;
            ns.run(function() {
                ns.set('test', i);

                promise = Promise.resolve().then(function() {
                    expect(ns.get('test')).to.equal(i);
                });
            });
            return promise;
        }, cb);
    });

    it('maintains context in then added outside ns scope', function(cb) {
        run(function(i) {
            var promise;
            ns.run(function() {
                ns.set('test', i);

                promise = Promise.resolve().then(function() {
                    expect(ns.get('test')).to.equal(i);
                });
            });

            return promise.then(function() {
                expect(ns.get('test')).to.equal(i);
            });
        }, cb);
    });

    it('maintains context in then after context lost previously in promise chain', function(cb) {
        run(function(i) {
            var promise;
            ns.run(function() {
                ns.set('test', i);

                promise = Promise.resolve().then(function() {
                    return new Promise(function(resolve) {
                        expect(ns.get('test')).to.equal(i);

                        loseContext(function() {
                            expect(ns.get('test')).to.equal(undefined);
                            resolve();
                        });
                    });
                }).then(function() {
                    expect(ns.get('test')).to.equal(i);
                });
            });

            return promise;
        }, cb);
    });

    function run(fn, cb) {
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
