var ASSERT = require('assert');
var FS = require('fs');
var PATH = require('path');

describe('plugins', function () {
    var testingPattern = String(Math.random() * 10e15);

    describe('fully features multiengine and multimiddleware', function () {
        var app, bem;
        before(function () {
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
            bem.usePlugin({
                engines     : [simpleEngine],
                middlewares : [simpleMiddleware]
            }, {id: 1});
        });

        it('should works properly', function (done) {
            app.render('index', {}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, '1');
                done();
            });
        });
    });

    describe('with simple engine and middleware', function () {
        var app, bem;
        before(function () {
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
            bem.usePlugin({
                engine     : simpleEngine,
                middleware : simpleMiddleware
            }, {id: 2});
        });

        it('should works properly', function (done) {
            app.render('index', {}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, '2');
                done();
            });
        });

        it('should throw if plugin is empty', function () {
            var app, bem;
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({}).bindTo(app);
            ASSERT.throws(function () {
                bem.usePlugin({});
            }, Error);
        });
    });

    describe('loading by string', function () {
        before(function (next) {
            FS.symlink(PATH.resolve('./test/data/express-bem-test-plugin'),
                './node_modules/express-bem-test-plugin', function (err) {
                    next();
                });
        });

        it('should load by full module name', function (done) {
            var app, bem;
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
            bem.usePlugin('express-bem-test-plugin');

            app.render('index', {t: testingPattern}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body.t, testingPattern);
                done();
            });
        });

        it('should load by path', function (done) {
            var app, bem;
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
            bem.usePlugin(PATH.resolve('./test/data/express-bem-test-plugin'));

            app.render('index', {t: testingPattern}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body.t, testingPattern);
                done();
            });
        });
    });

    describe('loading by generator', function () {
        it('should load simple', function (done) {
            var app, bem;
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
            bem.usePlugin(function () {
                return {
                    engines : [{
                        extension : simpleEngine.extension,
                        render    : simpleEngine
                    }]
                };
            });

            app.render('index', {content: testingPattern}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, testingPattern);
                done();
            });
        });
    });

    // simple engine
    function simpleEngine (name, options, cb) {
        cb(null, options.content);
    }
    simpleEngine.extension = '.someext.js';

    // generate content in middleware
    function simpleMiddleware (opts) {
        return function (ctx, next) {
            ctx.options.content = String(opts.id);
            next();
        };
    }
});
