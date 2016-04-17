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
/* global describe */

// init CLS namespace
var cls = require('continuation-local-storage'),
	clsNamespace = cls.createNamespace('test');

// load promise libraries
var libs = [
	['bluebird v2', require('bluebird2').clone()],
	['bluebird v3', require('bluebird3').clone()],
	['bluebird v2 with cls-bluebird', (function() {
		var Bluebird = require('bluebird2').clone();
		var clsBluebird = require('cls-bluebird');

		clsBluebird(clsNamespace, Bluebird);
		return Bluebird;
	})()],
	['bluebird v3 with cls-bluebird', (function() {
		var Bluebird = require('bluebird3').clone();
		var clsBluebird = require('cls-bluebird');

		clsBluebird(clsNamespace, Bluebird);
		return Bluebird;
	})()],
	['sequelize promise', (function() {
		var Sequelize = require('sequelize');
		Sequelize.cls = clsNamespace;
		return Sequelize.Promise;
	})()]
];
if (global.Promise) libs.unshift(['Native JS promise', global.Promise]);

// ensure all promise libs are different from eachother
for (var i = 0; i < libs.length; i++) {
	for (var j = i + 1; j < libs.length; j++) {
		if (libs[i][1] == libs[j][1]) throw new Error('lib ' + libs[i][0] + ' is same as ' + libs[j][0]);
	}
}

// run tests on each promise library
var tests = require('./tests');

libs.forEach(function(lib) {
	describe(lib[0], function() {
		tests(lib[1], clsNamespace);
	});
});
