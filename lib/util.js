
var PATH = require('path'),
    FS = require('fs'),
    VM = require('vm'),
    CRYPTO = require('crypto'),
    isPlainObject = require('lodash.isplainobject'),

    VOW = require('vow'),
    _assign = require('lodash.assign'),

    dirname = PATH.dirname,
    basename = PATH.basename,
    extname = PATH.extname,
    join = PATH.join;

exports.load = load;
exports.exec = exec;
exports.md5 = md5;
exports.fulfillName = fulfillName;
exports.unmaskName = unmaskName;
exports.objectValues = objectValues;
exports._assign = _assign;

/**
 * Caching loader some native file
 * @param {String|{file: String, force: Boolean}} opts filename or object with filename and options
 * @param {Function} cb
 */
function load (opts, cb) {
    var file;
    if (typeof opts === 'string') {
        file = opts;
        opts = {};
    } else {
        file = opts.file;
    }

    // try cache
    if (!opts.force && load.cache[file]) {
        process.nextTick(function () {
            cb(null, load.cache[file]);
        });
        return;
    }

    FS.readFile(file, 'utf-8', function (err, data) {
        load.cache[file] = data;
        cb(err, data);
    });
}

load.cache = Object.create(null);

/**
 * Caching loader some native file
 * @param {String|{file: String, force: Boolean, ctx: Object}} opts filename or object
 *   with filename, context and options
 * @param {Function} cb
 */
function exec (opts, cb) {
    var file, ctx;
    if (typeof opts === 'string') {
        file = opts;
        ctx = null;
        opts = {};
    } else {
        ctx = opts.ctx || null;
        file = opts.file;
    }

    // caching
    var ctxHash = ctx ? md5(ctx) : '';
    if (!opts.force && exec.cache[file] && exec.cache[file][ctxHash]) {
        process.nextTick(function () {
            cb(null, exec.cache[file][ctxHash]);
        });
        return;
    }

    load({file: file, force: opts.forceLoad}, function (err, content) {
        if (err) {
            cb(err);
            return;
        }

        var module = _assign({
            Vow     : VOW,
            console : console,
            require : require
        }, ctx);

        try {
            VM.runInNewContext(content, module, file + '.vm');
        } catch (e) {
            cb(e);
            return;
        }

        // caching
        exec.cache[file] = exec.cache[file] || {};
        exec.cache[file][ctxHash] = module;

        cb(null, module);
    });
}

exec.cache = Object.create(null);

/**
 * Appends filename with extension to path
 * @param {String|Object} name file name or hash with all function params
 * @param {String} ext extension if not exists
 * @param {String} [mask]
 * @returns {String}
 */
function fulfillName (name, ext, mask, lang) {
    var shortname;
    var params;

    // support hash with params as first function param
    if (isPlainObject(name)) {
        params = name;

        name = params.name;
        ext = params.ext;
        mask = params.mask;
        lang = params.lang;
    }

    shortname = basename(name);
    if (mask) {
        name = join(name, unmaskName(shortname, mask, lang));
    }

    var curext = extname(name);
    if (curext) {
        return name;
    }

    // prepend dot to extension
    if (ext[0] !== '.') {
        ext = '.' + ext;
    }

    return join(name, shortname + ext);
}

/**
 * Unmask name. E.g., for name "index" will replace "_?.js" to "_index.js".
 * @param {String} name
 * @returns {String}
 */
function unmaskName (name, mask, lang) {
    return mask
        .replace(/\?/g, name)
        .replace(/\{lang\}/g, lang);
}

/**
 * md5 oneliner
 * @param {*} obj
 * @results String
 */
function md5 (obj) {
    var md5sum = CRYPTO.createHash('md5');
    obj = typeof obj === 'string' ? obj : JSON.stringify(obj);
    md5sum.update(obj);
    return md5sum.digest('hex');
}

/**
 * Object.values
 * @param {Object} obj
 * @results {Array}
 */
function objectValues (obj) {
    return Object.keys(obj).map(function (k) {
        return obj[k];
    });
}
