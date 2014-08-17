
var EXPRESSUTILS = require('express/lib/utils'),

    FS = require('fs'),
    PATH = require('path'),

    dirname = PATH.dirname,
    basename = PATH.basename,
    extname = PATH.extname,
    join = PATH.join,
    exists = FS.existsSync || PATH.existsSync;

module.exports.patchView = patchView;
module.exports.lookup = createPatchedLookup;

/**
 * Patches express view to lookup in another directories
 * @api
 * @param {Express.View} View
 * @param {{path: String, extensions: String[]}} opts
 */
function patchView (View, opts) {
    // replace original with new our own
    View.prototype.lookup = createPatchedLookup(
        View.prototype.lookup,
        opts
    );
}

function createPatchedLookup (_lookup, opts) {
    opts.extensions = opts.extensions || [];
    if (!EXPRESSUTILS.isAbsolute(opts.path)) {
        opts.path = PATH.resolve(opts.projectRoot || process.cwd(), opts.path);
    }

    return function (path) {
        /* jscs: requireCurlyBraces:false */
        var ext = this.ext,
            extensionIndex = opts.extensions.indexOf(ext);

        // check for bem extension and absolute path
        if (EXPRESSUTILS.isAbsolute(path) || extensionIndex === -1) {
            // and return default if it is
            return _lookup.call(this, path);
        }

        // <path>/<bundle>/ with <bundle>.<engine> or not
        // @todo check
        path = join(opts.path, dirname(path), basename(path, ext));
        if (exists(path)) { return path; }
    };
}
