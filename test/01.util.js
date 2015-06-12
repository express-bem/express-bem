
var ASSERT = require('assert'),
    U = require('../lib/util'),
    fs = require('fs'),
    mock = require('mock-fs');

describe('util', function () {

    describe('.load', function () {
        var file = 'some.bundles/index/index.bh.js';
        var fileContent = 'content';

        beforeEach(function () {
            var fs = {};
            fs[file] = fileContent;
            mock(fs);
        });

        afterEach(mock.restore);

        it('should load file', function (done) {
            U.load(file, function (err, res) {
                if (err) { return done(err); }
                ASSERT.equal(res, fileContent);
                done();
            });
        });

        it('should use cache on second load', function (done) {
            U.load(file, function (err, res) {
                if (err) { return done(err); }
                fs.writeFile(file, 'some', function (err, res) {
                    if (err) { return done(err); }
                    U.load(file, function (err, res) {
                        if (err) { return done(err); }
                        ASSERT.equal(res, fileContent);
                        done();
                    });
                });
            });
        });

        it('should reload file if force flag is set', function (done) {
            U.load({file: file, force: true}, function (err, res) {
                if (err) { return done(err); }
                ASSERT.equal(res, fileContent);
                fs.writeFile(file, 'some', function (err) {
                    if (err) { return done(err); }
                    U.load({file: file, force: true}, function (err, res) {
                        if (err) { return done(err); }
                        ASSERT.equal(res, 'some');
                        done();
                    });
                });
            });
        });
    });

    describe('.exec', function () {
        var file = 'some.bundles/bundle/bundle.bh.js';
        var fileContent =
            'apply = ' + String(function (bemjson) {
                return JSON.stringify(bemjson);
            }) + ';';

        beforeEach(function () {
            var fs = {};
            fs[file] = fileContent;
            fs['index.php'] = '<?php\necho 1;\n';
            mock(fs);
        });

        afterEach(mock.restore);

        it('should exec file', function (done) {
            U.exec(file, function (err, ctx) {
                if (err) { return done(err); }
                ASSERT.equal(ctx.apply({k:'v'}), '{"k":"v"}');
                done();
            });
        });

        it('should exec file stored in cache', function (done) {
            U.exec({file: file, force: true, ctx: {a : 1}}, function (err, ctx) {
                if (err) { return done(err); }
                fs.writeFile(file, 'apply = function () { return "x"; };', function (err) {
                    if (err) { return done(err); }
                    U.exec({file: file, ctx: {a : 1}}, function (err, ctx) {
                        if (err) { return done(err); }
                        ASSERT.equal(ctx.apply('x'), '"x"');
                        done();
                    });
                });
            });
        });

        it('should reload and reexec file in cache', function (done) {
            U.exec({file: file}, function (err, ctx) {
                if (err) { return done(err); }
                fs.writeFile(file, 'apply = function () { return "y"; };', function (err) {
                    if (err) { return done(err); }
                    U.exec({file: file, force: true, forceLoad: true}, function (err, ctx) {
                        if (err) { return done(err); }
                        ASSERT.equal(ctx.apply('z'), 'y');
                        done();
                    });
                });
            });
        });

        // edge cases

        it('should fail if file does not exists', function (done) {
            U.exec('non-existance', function (err) {
                ASSERT(err);
                done();
            });
        });

        it('should fail if file is not executable', function (done) {
            U.exec('index.php', function (err) {
                ASSERT(err);
                done();
            });
        });
    });

    describe('.md5', function () {
        it('should calculate md5', function () {
            ASSERT(/^[a-z0-9]{32}$/.test(U.md5(Math.random())));
        });
    });

    describe('.fulfillName', function () {
        it('should fulfill name with ext', function () {
            ASSERT.equal(U.fulfillName('bundles/index', 'js'), 'bundles/index/index.js');
        });

        it('should fulfill name with dotted ext', function () {
            ASSERT.equal(U.fulfillName('bundles/index', '.js'), 'bundles/index/index.js');
        });

        it('should fulfill name with source mask, which masks name', function () {
            ASSERT.equal(U.fulfillName('index', 'js', '?.min.js'), 'index/index.min.js');
        });

        it('should fulfill name with source mask, which masks both name and lang', function () {
            ASSERT.equal(U.fulfillName('index', 'js', '?.{lang}.min.js', 'en'), 'index/index.en.min.js');
        });
    });

    describe('.unmaskName', function () {
        it('should return mask as is', function () {
            ASSERT.equal(U.unmaskName('index', 'mask'), 'mask');
        });

        it('should unmask name', function () {
            ASSERT.equal(U.unmaskName('index', '?.min.js'), 'index.min.js');
        });

        it('should unmask lang', function () {
            ASSERT.equal(U.unmaskName('index', '{lang}.min.js', 'en'), 'en.min.js');
        });
    });

    describe('.objectValues', function () {
        it('should return empty array for empty object', function () {
            ASSERT.deepEqual(U.objectValues({}), []);
        });

        it('should return values array for some object', function () {
            ASSERT.deepEqual(U.objectValues({key: 'value'}), ['value']);
        });

        it('should return the same array for array object', function () {
            ASSERT.deepEqual(U.objectValues([1, 2, 3]), [1, 2, 3]);
        });
    });

});
