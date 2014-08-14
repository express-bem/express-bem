
var exec = require('../util').exec,
    fulfillName = require('../util').fulfillName;

module.exports = bemhtmlEngine;

/**
 * Creates bemhtml.js express view engine
 * @api
 * @returns {function name: String, options: Object, cb: Function}
 */
function bemhtmlEngine (app, opts) {
    return function (name, options, cb) {
        name = fulfillName(name, opts.extension || 'bemhtml.js');

        // reject rendering for empty options.bemjson
        if (!options.bemjson) {
            cb(new Error('Empty request'));
            return;
        }

        // pass to render
        exec(name, function (err, module) {
            if (err || !module || !module.BEMHTML || !module.BEMHTML.apply) {
                cb(err || new Error('Unknown file format'));
                return;
            }

            // Renders bemjson to html via bemhtml
            cb(null, module.BEMHTML.apply(options.bemjson));
        });
    };
}
