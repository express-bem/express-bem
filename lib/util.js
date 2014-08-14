
var PATH = require('path'),
    FS = require('fs'),
    VM = require('vm'),
    CRYPTO = require('crypto'),

    VOW = require('vow'),
    BEM = require('bem'),

    dirname = PATH.dirname,
    basename = PATH.basename,
    extname = PATH.extname,
    join = PATH.join,

    env = process.env.NODE_ENV || 'development',
    env_cache = process.env.EXPRESS_BEM_CACHE,
    // caching enabled for any except development by default
    caching = env_cache === 'YES' || (env_cache === undefined && env !== 'development');

exports.caching = caching;
exports.load = load;
exports.exec = exec;
exports.md5 = md5;
exports.fulfillName = fulfillName;
exports.loadBemjson = loadBemjson;

/**
 * Caching loader some native file
 * @param {String} file
 * @param {Function} cb
 */
function load (file, cb) {
    if (load.caching && load.cache[file]) {
        cb(null, load.cache[file]);
        return;
    }
    FS.readFile(file, 'utf-8', function (err, data) {
        if (load.caching && data) {
            load.cache[file] = data;
        }
        cb(err, data);
    });
}

load.caching = caching;
if (load.caching) {
    load.cache = {};
}

// do we need ctx here?
function exec (file, ctx, cb) {
    if (arguments.length === 2 && typeof ctx === 'function') {
        cb = ctx;
        ctx = {};
    }

    // caching
    var ctxHash;
    if (exec.caching) {
        ctxHash = Object.keys(ctx).length && md5(ctx);
        if (exec.cache[file] && exec.cache[file][ctxHash]) {
            cb(null, exec.cache[file][ctxHash]);
            return;
        }
    }

    load(file, function (err, content) {
        if (err) {
            cb(err);
            return;
        }

        var module = BEM.util.extend({
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
        if (exec.caching) {
            exec.cache[file] = exec.cache[file] || {};
            exec.cache[file][ctxHash] = module;
        }

        cb(null, module);
    });
}

function loadBemjson (file, cb) {
    load(file, function (err, data) {
        if (err) {
            cb(err);
            return;
        }

        var sandbox = {},
            script = 'bemjson = ' + data;

        try {
            VM.runInNewContext(script, sandbox, file + '.vm');
        } catch (e) {
            cb(e);
            return;
        }

        cb(null, sandbox.bemjson);
    });
}

exec.caching = caching;
if (exec.caching) {
    exec.cache = {};
}

function make (bundlePath, cb) {
    //
}

/**
 * Appends filename with extension to path
 * @param {String} name path or file
 * @param {String} ext extension if not exists
 * @returns {String}
 */
function fulfillName (name, ext) {
    var curext = extname(name);
    if (curext) {
        return name;
    }

    // prepend dot to extension
    if (ext[0] !== '.') {
        ext = '.' + ext;
    }

    return join(name, basename(name) + ext);
}

function md5 (obj) {
    var md5sum = CRYPTO.createHash('md5');
    obj = typeof obj === 'string'? obj : JSON.stringify(obj);
    md5sum.update(obj);
    return md5sum.digest('hex');
}
