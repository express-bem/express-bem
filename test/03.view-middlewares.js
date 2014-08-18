var ASSERT = require('assert');

describe('view render middlewares', function () {
    var env = global.expressSetup({
        path : 'test/data/views/desktop.bundles'
    });

    it('should called in order they described, overload ctx and be async', function (done) {

        var testingOrder = [],
            testingPattern = Math.random() * 10e15;

        // should called first
        env.app.bem.use(function (ctx, next) {
            ctx.options.bemjson.content.push(testingPattern);
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

        env.case(this.test.title, function (req, res) {
            global.loadBemjson('./test/data/views/desktop.bundles/index/index.bemjson.js', function (err, bemjson) {
                res.render('index', {bemjson : bemjson});
            });

        }, function (error, response, body) {
            ASSERT.equal(JSON.stringify(testingOrder), JSON.stringify(['a', 'b']));
            ASSERT(body.indexOf(testingPattern) !== -1);
            done();
        });

    });

});
