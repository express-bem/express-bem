var ASSERT = require('assert'),

    U = require('.').util,
    loadBemjson = U.loadBemjson;

describe('auto bem make', function () {
    var env = global.expressSetup({
        root : 'test/data/testing-project',
        path : 'test/data/testing-project/desktop.bundles'
    });

    it('should generate html page with bemhtml', function (done) {

        env.case(this.test.title, function (req, res) {
            loadBemjson('./test/data/views/desktop.bundles/index/index.bemjson.js', function (err, bemjson) {
                res.render('index', { bemjson : bemjson });
            });

        }, function (error, response, body) {
            ASSERT.notEqual(body.indexOf('<!DOCTYPE'), -1);
            done();
        });

    });

});
