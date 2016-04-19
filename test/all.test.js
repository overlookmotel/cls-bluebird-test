// --------------------
// cls-bluebird-test module
// Tests
// --------------------

// modules
var chai = require('chai');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* global describe, it */

// init CLS namespace
var cls = require('continuation-local-storage'),
	clsNamespace = cls.createNamespace('test');

// load promise libraries
var Bluebird2 = require('bluebird2'),
	Bluebird3 = require('bluebird3'),
	_clsBluebird = require('cls-bluebird'),
	Sequelize = require('sequelize');

// prep promise libraries for testing
var clsBluebird = function(ns, Promise) {
	_clsBluebird(ns, Promise);
	return Promise;
};

var libs = [
	['Native JS promise', global.Promise, !global.Promise],
	['bluebird v2', Bluebird2.clone()],
	['bluebird v3', Bluebird3.clone()],
	['bluebird v2 with cls-bluebird', clsBluebird(clsNamespace, Bluebird2.clone())],
	['bluebird v3 with cls-bluebird', clsBluebird(clsNamespace, Bluebird3.clone())],
	['sequelize promise', (function() {
		Sequelize.cls = clsNamespace;
		return Sequelize.Promise;
	})()]
];

// ensure all promise libs are different from eachother
for (var i = 0; i < libs.length; i++) {
	if (!libs[i][1] && !libs[i][2]) throw new Error('lib ' + libs[i][0] + ' was not loaded');

	for (var j = i + 1; j < libs.length; j++) {
		if (libs[i][1] == libs[j][1]) throw new Error('lib ' + libs[i][0] + ' is same as ' + libs[j][0]);
	}
}

// run tests on each promise library
var tests = require('./tests');

libs.forEach(function(lib) {
	describe(lib[0], function() {
		if (!lib[2]) {
			tests(lib[1], clsNamespace);
		} else {
			it.skip('all tests');
		}
	});
});
