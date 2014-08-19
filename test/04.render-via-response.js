var ASSERT = require('assert');

describe('render via response', function () {
    var env = global.expressSetup({
        path : 'test/data/views/desktop.bundles'
    });

    var testingPattern = String(Math.random() * 10e15);

    before(function () {
        env.app.bem.engine('.someext.js', function (name, options, cb) {
            cb(null, options.content);
        });
    });

    it('should works', function (done) {

        env.case(this.test.title, function (req, res) {
            res.render('index', {content: testingPattern});

        }, function (error, response, body) {
            ASSERT(!error, error);
            ASSERT.equal(body, testingPattern);
            done();
        });

    });

});
