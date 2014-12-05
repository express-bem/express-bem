
var ASSERT = require('assert');
var PATH = require('path');

module.exports = Engines;

function Engines (expressBem) {
    var that = this;
    var engines = that;
    var enginesByExtension = {};
    var middlewares = [];

    Object.defineProperties(this, {
        add : {
            /**
             * add bem engine
             * @param {String} [name]
             * @param {String} [extension]
             * @param {Function|Object} engine
             * @returns {Engines}
             */
            value : function (name, extension, engine) {
                // add to storage
                this[name] = engine.render || engine;
                enginesByExtension[extension] = engine;

                return this;
            }
        },

        extensions : {
            get : function () {
                return Object.keys(enginesByExtension);
            }
        },

        byExtension : {
            value : function (ext) {
                return enginesByExtension[ext];
            }
        },

        use : {
            /**
             * use middleware
             * @param {String} [engine]
             * @param {Function} fn middleware or generator (depends on arity)
             * @param {Object} opts
             * @returns {Engines}
             */
            value : function (engine, fn, opts) {
                if (typeof engine === 'function') {
                    opts = fn;
                    fn = engine;
                    engine = null;
                }

                if (fn.length === 1) {
                    fn = fn.call(expressBem, opts);
                }

                ASSERT(fn.call, 'Invalid middleware');

                middlewares.push({
                    engine : engine,
                    fn     : fn
                });

                return this;
            }
        },

        proxy : {
            // all engines will pass through it
            value : function (name, options, cb) {
                var engine = enginesByExtension[this.ext],
                    that = this,
                    // queue
                    stack = [],
                    ctx = {
                        name    : name,
                        options : options,
                        cb      : cb
                    };

                this.engines = engines;
                this.thru = function (name, _name, _options, _cb) {
                    var engine = engines[name];
                    if (!engine) {
                        return cb(new Error('Unknown engine ' + name));
                    }
                    this.ext = engine.extension;
                    engine.call(this, _name || ctx.name, _options || ctx.options, _cb || ctx.cb);
                };

                options.forceLoad = options.hasOwnProperty('forceLoad') ? options.forceLoad : !expressBem.envLoadCache;
                options.forceExec = options.hasOwnProperty('forceExec') ? options.forceExec : !expressBem.envExecCache;

                if (!middlewares.length) {
                    return engine.call(this, ctx.name, ctx.options, ctx.cb);
                }

                // async fn queue
                middlewares.forEach(function (mw) {
                    if (!mw.engine /* || shouldUseMiddlewareFor(mw.engine)*/) {
                        stack.push(mw.fn);
                    }
                });

                // put engine as last call
                stack.push(function (ctx) {
                    engine.call(this, ctx.name, ctx.options, ctx.cb);
                });

                function next () {
                    var fn = stack.shift();
                    fn.call(that, ctx, next);
                }

                process.nextTick(next);

                return this;
            }
        }
    });
}

Engines.create = function createEngines (expressBem) {
    return new Engines(expressBem);
};
