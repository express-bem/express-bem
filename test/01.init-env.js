
var ASSERT = require('assert'),
    EXPRESSBEM = require('..');

describe('init-env', function () {

    describe('with different cache flags', function () {
        it('should initialize {cache: true} with full caching', function () {
            envCase({cache: true}, true, true);
        });

        it('should initialize {load: true} properly', function () {
            envCase({cache: {load: true}}, true, false);
        });
    });

    describe('in different environments', function () {
        it('should not initialize caching by default', function () {
            envCase({}, false, false);
        });

        it('should initialize env=production with full caching', function () {
            envCase({env: 'production'}, true, true);
        });

        it('should initialize env=development without load/exec caching', function () {
            envCase({env: 'development'}, false, false);
        });
    });

    describe('with env variables', function () {
        it('NODE_ENV="development" expects no load/exec cache', function () {
            envCase({processEnv: {NODE_ENV: 'development'}}, false, false);
        });

        it('NODE_ENV="production" expects full caching', function () {
            envCase({processEnv: {NODE_ENV: 'production'}}, true, true);
        });

        it('EXPRESS_BEM_CACHE=YES expects full caching', function () {
            envCase({processEnv: {EXPRESS_BEM_CACHE: 'YES'}}, true, true);
        });
    });

    function envCase (opts, load, exec) {
        var origProcessEnv = process.env;
        process.env = opts.processEnv || {};
        delete opts.processEnv;

        var expressBem = EXPRESSBEM(opts);

        ASSERT.equal(JSON.stringify({
            load : expressBem.envLoadCache,
            exec : expressBem.envExecCache
        }), JSON.stringify({
            load : load,
            exec : exec
        }));

        process.env = origProcessEnv;
    }

});
