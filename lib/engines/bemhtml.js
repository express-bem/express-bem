
var U = require('../util');

module.exports = bemhtmlEngine;

/**
 * bemhtml.js express view engine adapter
 * @api
 * @returns {function name: String, options: Object, cb: Function}
 */
function bemhtmlEngine (name, options, cb) {
    // reject rendering for empty options.bemjson
    if (!options.bemjson) {
        cb(new Error('Empty request'));
        return;
    }

    name = U.fulfillName(name, this.ext);

    // pass to render
    U.exec({
        file      : name,
        force     : options.forceExec,
        forceLoad : options.forceLoad
    }, function (err, module) {
        if (err || !module || !module.BEMHTML || !module.BEMHTML.apply) {
            cb(err || new Error('Unknown file format'));
            return;
        }

        // Renders bemjson to html via bemhtml
        cb(null, module.BEMHTML.apply(options.bemjson));
    });
}

bemhtmlEngine.extension = '.bemhtml.js';
