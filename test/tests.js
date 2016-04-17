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
    it('maintains context', function() {
        return twice(function(i) {
            var promise;
            ns.run(function() {
                ns.set('test', i);

                promise = Promise.resolve().then(function() {
                    expect(ns.get('test')).to.equal(i);
                });
            });
            return promise;
        });
    });

    it('maintains context in then after context lost previously in promise chain', function() {
        return twice(function(i) {
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
        });
    });

    it('maintains context in then added outside ns scope', function() {
        return twice(function(i) {
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
        });
    });

    function twice(fn) {
        var promises = [];

        for (var i = 0; i < 3; i++) {
            promises[i] = fn(i);
        }

        return Promise.all(promises);
    }
};
