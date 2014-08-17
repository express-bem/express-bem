
module.exports = complexEngine;

/**
 * full-stack bemhtml+bemjson express view engine adapter
 * @api
 * @param {String} name
 * @param {Object} options
 * @param {Function} cb
 */
function complexEngine (name, options, cb) {
    var that = this; // view

    // pass options.bemjson directly to bemhtml
    if (options.bemjson) {
        that.ext = that.engines.bemhtml.extension;
        that.engines.bemhtml.call(that, name, options, cb);
        return;
    }

    // return bemjson if requested
    if (options.raw === true) {
        that.ext = that.engines.bemtree.extension;
        that.engines.bemtree.call(that, name, options, cb);
        return;
    }

    // full stack
    that.ext = that.engines.bemtree.extension;
    that.engines.bemtree.call(that, name, options, function (err, bemjson) {
        if (err) {
            return cb(err);
        }

        options.bemjson = bemjson;
        that.ext = that.engines.bemhtml.extension;
        that.engines.bemhtml.call(that, name, options, function (err, data) {
            if (err) {
                cb(err);
            }
            cb(null, data);
        });
    });
}

complexEngine.extension = '.bem';
complexEngine.targetExtensions = ['.bemtree', '.bemhtml'];
