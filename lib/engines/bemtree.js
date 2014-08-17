
var U = require('../util');

module.exports = bemtreeEngine;

/**
 * bemtree.js express view adapter
 * @api
 * @returns {function name: String, options: Object, cb: Function}
 */
function bemtreeEngine (name, options, cb) {
    // create data object to pass to bemtree
    var data = options;

    name = U.fulfillName(name, this.ext);

    // Converts raw data to view-oriented (bemjson) via bemtree
    U.exec({
        file      : name,
        ctx       : data.global || null,
        force     : options.forceExec,
        forceLoad : options.forceLoad
    }, function (err, module) {
        if (err || !module || !module.BEMTREE || !module.BEMTREE.apply) {
            cb(err || new Error('Unknown file format'));
            return;
        }

        module.BEMTREE.apply(data).then(function (bemjson) {
            cb(null, bemjson);
        })
        .fail(cb);
    });
}

bemtreeEngine.extension = '.bemtree.js';
