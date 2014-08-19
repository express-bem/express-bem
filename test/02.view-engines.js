var ASSERT = require('assert');

describe('view engine', function () {
    var data = {yolo: 'swag'};
    var testResult = JSON.stringify({ext: '.testing', bundleName: 'index', data: data});
    var app;
    var bem;

    beforeEach(function () {
        app = global.EXPRESS();
        bem = global.EXPRESSBEM({path: './test/data/views/desktop.bundles'});
    });

    it('should render data via simple engine correctly', function (done) {
        bem.engine(simpleEngine);
        bem.bindTo(app);

        app.render('index', {data: data}, function (err, html) {
            ASSERT(!err, err);
            ASSERT(html, testResult);
            done();
        });
    });

    describe('with late initialization and concurrency', function () {
        beforeEach(function () {
            bem.bindTo(app);
            bem.engine('.testing1', function (name, options, cb) {
                cb(null, 'testing1-result');
            });
            bem.engine('.testing2', function (name, options, cb) {
                cb(null, 'testing2-result');
            });
            bem.engine('.testing3', function (name, options, cb) {
                cb(null, 'testing3-result');
            });
            app.set('view engine', '.testing2');
        });

        it('should render via default engine', function (done) {
            app.render('index', function (err, html) {
                ASSERT(!err, err);
                ASSERT(html, 'testing2-result');
                done();
            });
        });

        it('should render by extension', function (done) {
            app.render('index.testing1', function (err, html) {
                ASSERT(!err, err);
                ASSERT(html, 'testing1-result');
                done();
            });
        });

        it('should not render unknown ext', function () {
            ASSERT.throws(function () {
                app.render('index.another', function (err, html) { });
            });
        });
    });

    describe('late initialized engine with concrete extension', function () {
        beforeEach(function () {
            bem.bindTo(app);
            bem.engine(simpleEngine);
        });

        it('should render data correctly', function (done) {
            app.render('index.testing', {data: data}, function (err, html) {
                ASSERT(!err, err);
                ASSERT(html, testResult);
                done();
            });
        });
    });

    function simpleEngine (name, options, cb) {
        cb(null, JSON.stringify({
            ext        : this.ext,
            bundleName : this.name.replace(this.ext, ''),
            data       : options.data
        }));
    }
    simpleEngine.extension = '.testing';

});
