var ASSERT = require('assert');

describe('view middlewares', function () {
    var env = global.expressSetup({
        path : 'test/data/views/desktop.bundles'
    });

    var testingOrder = [];
    var testingPattern = Math.random() * 10e15;
    var testingPattern2 = Math.random() * 10e15;

    before(function () {
        env.app.bem.engine('.someext.js', function (name, options, cb) {
            cb(null, JSON.stringify({name: this.name, data: options.data}));
        });

        // should called first
        env.app.bem.use(function (ctx, next) {
            ctx.options.data = [ctx.options.data, testingPattern];
            setTimeout(function () {
                testingOrder.push('a');
                next();
            }, 20);
        });

        // should called next
        env.app.bem.use(function (ctx, next) {
            testingOrder.push('b');
            next();
        });

        // should be generated and called last
        env.app.bem.use(function (opts) {
            return function (ctx, next) {
                testingOrder.push(opts.param);
                next();
            };
        }, {param: 'c'});
    });

    it('should called in order they described, overload ctx, be async and generate middleware', function (done) {

        env.app.render('index', {data: testingPattern2}, function (err, body) {
            ASSERT(!err, err);
            ASSERT.equal(JSON.stringify(testingOrder), JSON.stringify(['a', 'b', 'c']));
            ASSERT(body.indexOf(testingPattern) !== -1);
            ASSERT(body.indexOf(testingPattern2) !== -1);
            done();
        });

    });

});
