
var EXPRESS = require('express'),
    REQUEST = require('request'),

    EXPRESSBEM = require('..'),
    VM = require('vm'),
    U = require('../lib/util');

global.expressSetup = expressSetup;
global.loadBemjson = loadBemjson;

function expressSetup (opts) {
    var env = {};

    before(function () {
        env.app = EXPRESS();

        env.app.bem = EXPRESSBEM(opts).bindTo(env.app);

        env.server = env.app.listen(function () {
            // store port to send requests later
            env.port = env.server.address().port;
        });
    });

    // stop listening after tests
    after(function () {
        env.server.close();
    });

    env.case = function (title, route, assert) {
        env.app.get(urlPath(title), route);
        REQUEST(url(title), assert);
    };

    function urlPath (title) {
        return '/' + U.md5(title);
    }
    function url (title) {
        return 'http://localhost:' + env.port + urlPath(title);
    }

    return env;
}

function loadBemjson (file, cb) {
    U.load(file, function (err, data) {
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
