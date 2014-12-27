var ASSERT = require('assert');

describe('view-thru', function () {
    var testingPattern = String(Math.random() * 10e15);

    describe('engines-objects with thru', function () {
        var app, bem;
        before(function () {
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
            bem.usePlugin({
                engines : [{
                    extension : '.t1.js',
                    render    : function (name, options, cb) {
                        options.content.push('c');
                        cb(null, options.content.join());
                    }
                }, {
                    extension : '.t2.js',
                    render    : function (name, options, cb) {
                        options.content.push('b');
                        this.thru('t1');
                    }
                }]
            });
        });

        it('should works properly', function (done) {
            app.render('index.t2.js', {content: ['a']}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, 'a,b,c');
                done();
            });
        });
    });

    describe('.engine with thru & .usePlugin', function () {
        var app, bem;
        beforeEach(function () {
            app = global.EXPRESS();
            bem = global.EXPRESSBEM({root : 'test/data/views'}).bindTo(app);
        });

        it('should works with usePlugin + engine', function (done) {
            bem.usePlugin('./test/data/express-bem-canonical-plugin');
            bem.engine('t1', '.t1.js', function (name, options, cb) {
                this.thru('canonical', name, options, function (err, data) {
                    cb(err, data);
                });
            });

            app.render('index.t1.js', {content: ['a']}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, 'Content: ["a"]');
                done();
            });
        });

        it('should works with engine + usePlugin', function (done) {
            bem.engine('t1', '.t1.js', function (name, options, cb) {
                this.thru('canonical', name, options, function (err, data) {
                    cb(err, data);
                });
            });
            bem.usePlugin('./test/data/express-bem-canonical-plugin');

            app.render('index.t1.js', {content: ['a']}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, 'Content: ["a"]');
                done();
            });
        });

        it('should works with inner thru', function (done) {
            bem.usePlugin('./test/data/express-bem-canonical-plugin');
            bem.engine('local', '.local.js', function (name, options, cb) {
                cb(null, {local: options.content});
            });
            bem.engine('fullstack', '.fullstack.js', function (name, options, cb) {
                var view = this;
                view.thru('local', name, options, function (err, data) {
                    if (err) {
                        return cb(err);
                    }
                    options.content = data;
                    view.thru('canonical', name, options, function (err, data) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, data);
                    });
                });
            });

            app.render('index.fullstack.js', {content: ['a']}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, 'Content: {"local":["a"]}');
                done();
            });
        });

        it('should works with inner thru defined in reverse order', function (done) {
            bem.engine('fullstack', '.fullstack.js', function (name, options, cb) {
                var view = this;
                view.thru('local', name, options, function (err, data) {
                    if (err) {
                        return cb(err);
                    }
                    options.content = data;
                    view.thru('canonical', name, options, function (err, data) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, data);
                    });
                });
            });
            bem.engine('local', '.local.js', function (name, options, cb) {
                cb(null, {local: options.content});
            });
            bem.usePlugin('./test/data/express-bem-canonical-plugin');

            app.render('index.fullstack.js', {content: ['a']}, function (err, body) {
                ASSERT(!err, err);
                ASSERT.equal(body, 'Content: {"local":["a"]}');
                done();
            });
        });
    });
});
