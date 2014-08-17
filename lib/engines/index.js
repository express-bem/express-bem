
module.exports = Engines;

function Engines (expressBem) {
    var that = this,
        engines = that,
        enginesByExtension = {},
        middlewares = [];

    Object.defineProperties(this, {
        add : {
            /**
             * add bem engine
             * @param {String} name
             * @param {String} [ext]
             * @param {Function} [engine]
             * @returns {Engines}
             */
            value : function (name, ext, engine) {
                if (typeof ext === 'function') {
                    engine = ext;
                    ext = engine.extension;
                }

                engine = engine || require('./' + name);
                ext = ext || engine.extension;

                if (ext[0] !== '.') {
                    ext = '.' + ext;
                }

                // add to storage
                this[name] = engine;
                enginesByExtension[ext] = engine;

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
             * @param {Function} fn
             * @returns {Engines}
             */
            value : function (engine, fn) {
                if (fn === undefined) {
                    fn = engine;
                    engine = null;
                }
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

                options.forceLoad = options.hasOwnProperty('forceLoad')? options.forceLoad : !expressBem.envLoadCache;
                options.forceExec = options.hasOwnProperty('forceExec')? options.forceExec : !expressBem.envExecCache;

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

/**
 * @class Bundle
 * @property {String} bundlesPath   Путь до всех бандлов
 * @property {String} bundlePath    Путь до текущего бандла
 * @property {String} BEMHTMLFile   Путь до BEMHTML-файла бандла
 * @property {String} BEMTREEFile   Путь до BEMTREE-файла бандла
 * @property {String} jsFileName    Имя JS-файла бандла
 * @property {String} cssFileName   Имя CSS-файла бандла
 * @property {String} jsFile        Путь до JS-файла бандла
 * @property {String} cssFile       Путь до CSS-файла бандла
 * @property {Object} BEMHTML       Объект для работы с BEMHTML
 * @property {Object} BEMTREE       Объект для работы с BEMTREE
 */

/**
 * Добавляет новый бандл
 * @param {String} name Имя бандла
 * @param {Object} [context] Объект переменных, которые будут доступны глобально в BEMTREE
 *  по умолчанию в глобальный контекст пробрасываются: console, require, Vow
 * @constructor

function Bundle(name, context) {

    this.name = name;
    this.context = context || {};

    this._setPath();
}

Bundle.prototype = {

    /**
     * Установить информацию по путям до директорий и файлов бандла

    _setPath: function() {

        var bundlesPath = 'desktop.bundles',
            relativeBundlePath = path.join(bundlesPath, this.name),
            bundlePath = path.join(__dirname, relativeBundlePath);

        this.relativePath = relativeBundlePath;
        this.path = bundlePath;

        this.BEMHTMLFile = path.join(bundlePath, this.name + '.bemhtml.js');
        this.BEMTREEFile = path.join(bundlePath, this.name + '.bemtree.js');

        this.depsFile = path.join(bundlePath, this.name + '.deps.js');

        this.jsFileName = '_' + this.name + '.js';
        this.cssFileName = '_' + this.name + '.css';

        this.jsFile = path.join(bundlePath, this.jsFileName);
        this.cssFile = path.join(bundlePath, this.cssFileName);
    },

    /**
     * Установить информацию по собранным файлам
     *
    setInfo: function() {
        delete require.cache[this.BEMHTMLFile];
        this.BEMHTML = require(this.BEMHTMLFile).BEMHTML;
        this.BEMTREE = this._getBEMTREE();
    },

    /**
     * Собрать бандл
     * @returns {Function}
     *
    make: function() {
        return function(req, res, next) {

            if(process.env.NODE_ENV === 'production') {
                this.setInfo();
                next();
                return;
            }

            process.env.BEMHTML_ENV = 'development';

            bemLevel.resetLevelsCache();
            bem.api.make({ verbosity: 'debug' }, {targets: [this.relativePath]}).then(function() {
                this.setInfo();
                next();
            }.bind(this)).done();

        }.bind(this);
    },

    /**
     * Получить переменную BEMTREE с нужным контекстом
     * @returns {Object}
     * @private
     *
    _getBEMTREE: function() {

        var BEMTREEContent = fs.readFileSync(this.BEMTREEFile, 'utf-8'),

            context = bem.util.extend({

                console: console,
                require: require,

                Vow: vow

            }, this.context);

        vm.runInNewContext(BEMTREEContent, context);

        return context.BEMTREE;
    }

};
*/
