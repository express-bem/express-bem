var ASSERT = require('assert');

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
