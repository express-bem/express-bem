
var EXPRESS = require('express'),
    REQUEST = require('request'),

    EXPRESSBEM = require('.'),
    md5 = EXPRESSBEM.util.md5;

global.expressSetup = expressSetup;

function expressSetup (opts) {
	var env = {};

    before(function () {
        env.app = EXPRESS();

        // its like three in one:
        // EXPRESSBEM.patchView(require('express/lib/view'), 'test/data/views/desktop.bundles');
        // app.engine('bemhtml.js', EXPRESSBEM.bemhtmlEngine());
        // app.engine('bemtree.js', EXPRESSBEM.bemtreeEngine());
        // app.set('view engine', 'bemtree.js');
        EXPRESSBEM(env.app, opts);

        env.app.server = env.app.listen(function () {
            // store port to send requests later
            env.port = env.app.server.address().port;
        });
    });

    // stop listening after tests
    after(function () {
        env.app.server.close();
    });

    env.case = function (title, route, assert) {
    	env.app.get(urlPath(title), route);
    	REQUEST(url(title), assert);
    };

	function urlPath (title) {
	    return '/' + md5(title);
	}
	function url (title) {
	    return 'http://localhost:' + env.port + urlPath(title);
	}

	return env;
}
