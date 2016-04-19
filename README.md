# cls-bluebird-test.js

# Testing CLS context passing with Bluebird promises

## Current status

[![NPM version](https://img.shields.io/npm/v/cls-bluebird-test.svg)](https://www.npmjs.com/package/cls-bluebird-test)
[![Build Status](https://img.shields.io/travis/overlookmotel/cls-bluebird-test/master.svg)](http://travis-ci.org/overlookmotel/cls-bluebird-test)
[![Dependency Status](https://img.shields.io/david/overlookmotel/cls-bluebird-test.svg)](https://david-dm.org/overlookmotel/cls-bluebird-test)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/cls-bluebird-test.svg)](https://david-dm.org/overlookmotel/cls-bluebird-test)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/cls-bluebird-test/master.svg)](https://coveralls.io/r/overlookmotel/cls-bluebird-test)

## Usage

The intention of this repo is to establish, when using promises on node.js, in what circumstances [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage) context is maintained, and in what cases it gets lost.

This repo contains tests which:

* Try various different ways of using promises
* Test whether [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage) context is maintained or not in all these cases
* Run these tests against various promise implementations

The tests are run against the following Promise implementations:

* Native JS Promise (where available)
* [bluebird](https://www.npmjs.com/package/bluebird) v2.x
* [bluebird](https://www.npmjs.com/package/bluebird) v3.x
* bluebird v2.x with [cls-bluebird](https://www.npmjs.com/package/cls-bluebird) shim
* bluebird v3.x with [cls-bluebird](https://www.npmjs.com/package/cls-bluebird) shim
* bluebird v3.x with prototype [cls-bluebird2](https://github.com/overlookmotel/cls-bluebird2) shim
* [sequelize](https://www.npmjs.com/package/sequelize) Promise (another approach to shimming bluebird v3.x)

### Running the tests

Clone this repo then...

```
npm install
npm test
```

### Inspect test results on Travis

Travis CI runs the tests on the following version of node:

* 0.10.x (Native JS Promise is skipped)
* 0.12.x
* 4.x
* 5.x

The results can be viewed at [travis-ci.org/overlookmotel/cls-bluebird-test/](https://travis-ci.org/overlookmotel/cls-bluebird-test/)

## Changelog

See [changelog.md](https://github.com/overlookmotel/cls-bluebird-test/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/cls-bluebird-test/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
