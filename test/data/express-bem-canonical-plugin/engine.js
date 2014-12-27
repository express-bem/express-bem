module.exports = canonical;
canonical.extension = '.canonical.js';

/**
 * canonical.js express view engine adapter
 * @param {string} name
 * @param {Object} options
 * @param {Function} cb
 * @api
 */
function canonical(name, options, cb) {
    // Renders bemjson to html via bemhtml
    cb(null, 'Content: ' + JSON.stringify(options.content));
}
