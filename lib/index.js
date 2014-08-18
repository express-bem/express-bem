
var Engines = require('./engines/index'),
    U = require('./util'),

    lookupPatcher = require('./view-lookup'),

    PATH = require('path'),
    BEM = require('bem'),
    BEMLEVEL = BEM.require('./level');

module.exports = function (opts) {
    return new ExpressBem(opts);
};

/**
 * Default bundles root
 */
ExpressBem.PATH = 'desktop.bundles';

/**
 * Extensions
 */
ExpressBem.EXTENSIONS = {
    // This extension will be used by default for bemhtml engine
    bemhtml : '.bemhtml.js',
    // ... for bemtree engine
    bemtree : '.bemtree.js',
    // Special behaviour extension
    complex : '.bem'
};

/**
 * Bem engine by default
 */
ExpressBem.DEFAULT_ENGINE = 'complex';

/**
 * Initialize
 */
function ExpressBem (opts) {
    opts = opts || {};

    // project root for bem project
    this.projectRoot = PATH.resolve(opts.projectRoot || process.cwd());
    // bundles path
    this.bundlesPath = PATH.resolve(this.projectRoot, opts.path || ExpressBem.PATH);
    // relative path to bundles
    this.path = opts.path || ExpressBem.PATH;

    this.extensions = opts.extensions || {};

    this.engines = Engines.create(this);

    this.extensions = {};
    this.defaultEngine = opts.defaultEngine || ExpressBem.DEFAULT_ENGINE;

    this._initEnv(opts);

    // init extensions
    var incExtensions = opts.extensions || {};
    Object.keys(ExpressBem.EXTENSIONS).forEach(function (k) {
        this.extensions[k] = incExtensions[k] || ExpressBem.EXTENSIONS[k];
        if (this.extensions[k][0] !== '.') {
            this.extensions[k] = '.' + this.extensions[k];
        }
    }.bind(this));

    // init engines and fill extensions hash
    Object.keys(this.extensions).forEach(function (name) {
        this.engines.add(name, this.extensions[name]);
    }.bind(this));

    this.expressViewEngine = this.engines.proxy;
}

ExpressBem.prototype.expressViewEngine = null;

/**
 * @param {Express} app
 * @returns {ExpressBem}
 */
ExpressBem.prototype.bindTo = function (app) {
    // should be dynamic
    U.objectValues(this.extensions).forEach(function (ext) {
        app.engine(ext, this.engines.proxy);
    }.bind(this));

    app.set('view engine', this.extensions[this.defaultEngine]);

    this.patchView(app.get('view'));

    return this;
};

ExpressBem.prototype.use = function () {
    this.engines.use.apply(this.engines, arguments);
    return this;
};

// env and caching, making. dev purposes
ExpressBem.prototype._initEnv = function (opts) {
    var env = this.env = opts.env || process.env.NODE_ENV || 'development',
        globalCache = typeof opts.cache === 'boolean' ? opts.cache : undefined,
        cacheObj = typeof opts.cache === 'object' ? opts.cache : {},
        envGlobalCacheKey = 'EXPRESS_BEM_CACHE';

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
    lookupPatcher.patchView(View, {
        path       : this.bundlesPath,
        extensions : U.objectValues(this.extensions)
    });
};

/**
 * Api
 */
ExpressBem.patchView = lookupPatcher.patchView;
ExpressBem.lookup = lookupPatcher.lookup;
