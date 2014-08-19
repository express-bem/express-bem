
var ASSERT = require('assert');
var PATH = require('path');

var BEM = require('bem');
var BEMLEVEL = BEM.require('./level');

var U = require('./util');
var Engines = require('./engines.js');
var lookupPatcher = require('./view-lookup');

module.exports = function (opts) {
    return new ExpressBem(opts);
};

/**
 * Default bundles root
 */
ExpressBem.PATH = 'desktop.bundles';

/**
 * Initialize
 */
function ExpressBem (opts) {
    opts = opts || {};

    // project root for bem project
    this.projectRoot = PATH.resolve(opts.projectRoot || opts.root || process.cwd());
    // bundles path
    this.bundlesPath = PATH.resolve(this.projectRoot, opts.path || ExpressBem.PATH);
    // relative path to bundles
    this.relativePath = opts.path || ExpressBem.PATH;

    // engines
    this.engines = Engines.create(this);
    this.expressViewEngine = this.engines.proxy;

    // env cap! yea.
    this._initEnv(opts);
}

ExpressBem.prototype.expressViewEngine = null;
ExpressBem.prototype.defaultEngineExtension = null;

ExpressBem.prototype.expressApp = null;

/**
 * @param {Express} app
 * @returns {ExpressBem}
 */
ExpressBem.prototype.bindTo = function (app) {
    ASSERT(!this.expressApp, 'Already bound!');

    this.expressApp = app;

    // patch view lookup
    app.set('view', this.patchView(app.get('view')));

    // register already declared engines in expressApp
    this.engines.extensions.forEach(function (ext) {
        var engine = this.engines.byExtension(ext);
        app.engine(engine.extension, this.expressViewEngine);
    }.bind(this));

    // set first declared extension as default
    app.set('view engine', this.defaultEngineExtension);

    return this;
};

/**
 * plugin usage
 * @param {String|Object|Function} plugin
 *   Available object format {engine: Function, engines: Function[], middleware: Function, middlewares: Function[]}
 * @param {Object} [opts]
 */
ExpressBem.prototype.usePlugin = function (plugin, opts) {
    opts = opts || {};

    // if string passed
    if (typeof plugin === 'string') {
        try {
            plugin = require(plugin);
        } catch (e) {
            var modulePath = PATH.resolve(process.cwd(), plugin);
            plugin = require(modulePath);
        }
    }

    // if generator function passed
    if (typeof plugin === 'function') {
        plugin = plugin.call(this, opts);
    }

    // check plugin consistency
    ASSERT.equal(typeof plugin, 'object', 'Can\'t resolve plugin');

    // fetch engines and middlewares
    var engines = plugin.engines || (plugin.engine ? [plugin.engine] : []);
    var middlewares = plugin.middlewares || (plugin.middleware ? [plugin.middleware] : []);

    // check emptiness
    ASSERT(engines.length || middlewares.length, 'Seems like your plugin is empty or invalid');

    engines.forEach(function (engine) {
        this.engine(engine);
    }.bind(this));
    middlewares.forEach(function (middleware) {
        this.use(middleware, opts);
    }.bind(this));

    return this;
};

/**
 * add bem engine
 * @param {String} [name] name
 * @param {String} [ext] extension
 * @param {Function|Object} engine
 * @returns {ExpressBem}
 */
ExpressBem.prototype.engine = function (name, ext, engine) {
    if (arguments.length === 1 && typeof name === 'function') {
        engine = name;
        ext = engine.extension;
        name = null;

    } else if (arguments.length === 1 && typeof name === 'object') {
        engine = name.render || name.engine;
        ext = name.ext || name.extension;
        name = name.name;

    } else if (arguments.length === 2 && typeof ext === 'function') {
        engine = ext;
        if (name[0] === '.') {
            ext = name;
            name = null;
        } else {
            ext = engine.extension || '.' + name;
        }
    }

    ASSERT(engine, 'Engine is required');

    ext = ext || engine.extension;
    name = name || engine.name || ext.replace(/^\.|\.js$/g, '');

    ASSERT(ext, 'Extension was not passed nor resolved');
    ASSERT(name, 'Name was not passed nor resolved');

    if (ext[0] !== '.') {
        ext = '.' + ext;
    }

    // probably we should copy function object
    engine.name = name;
    engine.extension = ext;

    this.engines.add(name, ext, engine);

    if (!this.defaultEngineExtension) {
        this.defaultEngineExtension = engine.extension;
        if (this.expressApp) {
            this.expressApp.set('view engine', this.defaultEngineExtension);
        }
    }
    if (this.expressApp) {
        this.expressApp.engine(ext, this.expressViewEngine);
    }

    return this;
};

/**
 * use middleware
 * @param {String} [engine]
 * @param {Function} fn middleware or generator (depends on arity)
 * @param {Object} opts
 * @returns {Engines}
 */
ExpressBem.prototype.use = function (engine, fn, opts) {
    this.engines.use.apply(this.engines, arguments);
    return this;
};

// env and caching, making. dev purposes
ExpressBem.prototype._initEnv = function (opts) {
    var env = this.env = opts.env || process.env.NODE_ENV || 'development';
    var globalCache = typeof opts.cache === 'boolean' ? opts.cache : undefined;
    var cacheObj = typeof opts.cache === 'object' ? opts.cache : {};
    var envGlobalCacheKey = 'EXPRESS_BEM_CACHE';

    // ... and load enabled
    this.envLoadCache = initVar('load', 'EXPRESS_BEM_CACHE_LOAD');

    // ... and load enabled
    this.envExecCache = initVar('exec', 'EXPRESS_BEM_CACHE_EXEC');

    /**
     * cache variable initializer
     * @param {String} key
     * @param {String} envKey
     * @param {Boolean} [def] result of (env !== 'development') by default
     * @returns {Boolean}
     */
    function initVar (key, envKey, def) {
        def = (arguments.length < 3) ? (env !== 'development') : def;
        var negate = !def;
        switch (true) {
            case globalCache !== undefined:
                return globalCache;
            case cacheObj.hasOwnProperty(key):
                return cacheObj[key];
            case process.env.hasOwnProperty(envGlobalCacheKey):
                return process.env[envGlobalCacheKey] !== '';
            case process.env.hasOwnProperty(envKey):
                return negate ? process.env[envKey] === 'YES' : process.env[envKey] !== 'NO';
            default:
                return def;
        }
    }
};

ExpressBem.prototype.patchView = function (View) {
    var engines = this.engines;
    return lookupPatcher.patchView(View, {
        path       : this.bundlesPath,
        extensions : function () {
            return engines.extensions;
        }
    });
};
