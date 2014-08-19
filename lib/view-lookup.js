
var EXPRESSUTILS = require('express/lib/utils'),

    FS = require('fs'),
    PATH = require('path'),

    dirname = PATH.dirname,
    basename = PATH.basename,
    join = PATH.join,
    exists = FS.existsSync || PATH.existsSync;

module.exports.patchView = patchView;

/**
 * Patches express view to lookup in another directories
 * @api
 * @param {Function} ExpressView
 * @param {{path: String, extensions: String[]|Function}} opts
 */
function patchView (ExpressView, opts) {
    var proto = ExpressView.prototype;
    function View (name, options) {
        options = options || {};
        this.name = name;
        this.root = options.root;
        var engines = options.engines;
        this.defaultEngine = options.defaultEngine;
        var extensions = (typeof opts.extensions === 'function') ? opts.extensions() : opts.extensions;
        this.extensions = extensions;
        var ext = this.ext = extname(name, extensions);
        if (!ext && !this.defaultEngine) {
            throw new Error('No default engine was specified and no extension was provided.');
        }
        if (!ext) {
            name += (ext = this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine);
        }
        this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
        this.path = this.lookup(name);
    }
    View.prototype = proto;

    function extname (name, extensions) {
        if (extensions && extensions.length) {
            var ext;
            for (var i = 0, l = extensions.length; i < l; i += 1) {
                ext = extensions[i];
                if (-1 !== name.indexOf(ext)) {
                    return ext;
                }
            }
        }
        return PATH.extname(name);
    }

    // replace original with new our own
    proto.lookup = createLookup(proto.lookup, opts);

    return View;
}

function createLookup (_lookup, opts) {
    opts = opts || {};
    opts.extensions = opts.extensions || [];

    if (!EXPRESSUTILS.isAbsolute(opts.path)) {
        opts.path = PATH.resolve(opts.projectRoot || process.cwd(), opts.path);
    }

    return function (path) {
        var ext = this.ext;
        var extensions = this.extensions;
        var extensionIndex = extensions.indexOf(ext);

        // check for bem extension and absolute path
        if (EXPRESSUTILS.isAbsolute(path) || extensionIndex === -1) {
            // and return default if it is
            return _lookup.call(this, path);
        }

        // <path>/<bundle>/ with <bundle>.<engine> or not
        // @todo check
        path = join(opts.path, dirname(path), basename(path, ext));
        if (exists(path)) {
            return path;
        }
    };
}
