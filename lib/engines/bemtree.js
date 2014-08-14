
var exec = require('../util').exec,
    fulfillName = require('../util').fulfillName;

module.exports = bemtreeEngine;

/**
 * Creates bemhtml.js express view engine
 * @api
 * @returns {function name: String, options: Object, cb: Function}
 */
function bemtreeEngine (app, opts) {
    return function (name, options, cb) {
        name = fulfillName(name, opts.extension || 'bemtree.js');

        // create data object to pass to bemtree
        var data = options;

        // Converts raw data to view-oriented (bemjson) via bemtree
        exec(name, data.global || {}, function (err, module) {
            if (err || !module || !module.BEMTREE || !module.BEMTREE.apply) {
                cb(err || new Error('Unknown file format'));
                return;
            }

            module.BEMTREE.apply(data)
               .then(function (bemjson) {
                    cb(null, bemjson);
                })
               .fail(cb);
        });
    };
}
