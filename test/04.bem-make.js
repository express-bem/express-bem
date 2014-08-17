var ASSERT = require('assert');

describe('bem-make', function () {
    this.timeout(20000);

    var env = global.expressSetup({
        cache       : { make: false },
        projectRoot : 'test/data/testing-project'
    });

    it('should have make-cache in false state', function () {
        ASSERT(!env.app.bem.envMakeCache);
    });

    it('should generate html page with bemhtml', function (done) {

        env.case(this.test.title, function (req, res) {
            global.loadBemjson('./test/data/testing-project/desktop.bundles/index/index.bemjson.js', function (err, bemjson) {
                res.render('index', { bemjson : bemjson });
            });

        }, function (error, response, body) {
            ASSERT.notEqual(body.indexOf('<!DOCTYPE'), -1);
            done();
        });

    });

});
