
var EXPRESSVIEW = require('express/lib/view'),

    bemhtmlEngine = require('./engines/bemhtml'),
    bemtreeEngine = require('./engines/bemtree'),
    lookupPatcher = require('./view-lookup-patcher');

module.exports = ExpressBem;

/**
 * Default bundles root
 */
ExpressBem.path = 'desktop.bundles';

/**
 * Extensions
 */
ExpressBem.extensions = {
    // This extension will be used by default for bemhtml engine
    bemhtml : 'bemhtml.js',
    // ... for bemtree engine
    bemtree : 'bemtree.js',
    // Special behaviour extension
    virtual : 'bem'
};

/*
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

        }.bind(this);*/

/**
 * util
 */
ExpressBem.util = require('./util');

/**
 * Initialize
 */
function ExpressBem (app, opts) {
    opts = opts || {};
    opts.path = opts.path || ExpressBem.path;
    opts.extensions = opts.extensions || {};
    opts.extensions.bemhtml = opts.extensions.bemhtml || ExpressBem.extensions.bemhtml;
    opts.extensions.bemtree = opts.extensions.bemtree || ExpressBem.extensions.bemtree;
    opts.extensions.virtual = opts.extensions.virtual || ExpressBem.extensions.virtual;

    var engines = {
        bemhtml : bemhtmlEngine(app, { extension: opts.extensions.bemhtml }),
        bemtree : bemtreeEngine(app, { extension: opts.extensions.bemtree }),
        virtual : virtualEngine(app, { extension: opts.extensions.virtual })
    };

    app.engine(opts.extensions.bemhtml, engines.bemhtml);
    app.engine(opts.extensions.bemtree, engines.bemtree);
    app.engine(opts.extensions.virtual, engines.virtual);
    app.set('view engine', opts.extensions.virtual);

    lookupPatcher.patchView(EXPRESSVIEW, {
        path       : opts.path,
        extensions : Object.keys(opts.extensions)
            .map(function (k) {
                return opts.extensions[k];
            })
    });

    function virtualEngine (app) {
        return function (name, options, cb) {
            // pass options.bemjson directly to bemhtml
            if (options.bemjson) {
                engines.bemhtml(name, options, cb);
                return;
            }

            // return bemjson if requested
            if (options.raw === true) {
                engines.bemtree(name, options, function (err, data) {
                    cb(err, data);
                });
                return;
            }

            // full stack
            engines.bemtree(name, options, function (err, bemjson) {
                if (err) {
                    return cb(err);
                }
                options.bemjson = bemjson;
                engines.bemhtml(name, options, cb);
            });
        };
    }
}

/**
 * Api
 */
ExpressBem.patchView = lookupPatcher.patchView;
ExpressBem.lookup = lookupPatcher.lookup;
ExpressBem.bemhtmlEngine = bemhtmlEngine;
ExpressBem.bemtreeEngine = bemtreeEngine;
