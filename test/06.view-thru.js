var ASSERT = require('assert');

describe('plugins', function () {
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

});
