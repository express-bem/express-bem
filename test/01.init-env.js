
var ASSERT = require('assert'),
    EXPRESSBEM = require('.');

describe('init-env', function () {

    describe('with different cache flags', function () {
        it('should initialize {cache: true} with full caching', function () {
            envCase({cache: true}, true, true, true);
        });

        it('should initialize {load: true} properly', function () {
            envCase({cache: {load: true}}, true, true, false);
        });

        it('should initialize {make: false} properly', function () {
            envCase({cache: {make: false}}, false, false, false);
        });
    });

    describe('in different environments', function () {
        it('should not initialize caching by default', function () {
            envCase({}, true, false, false);
        });

        it('should initialize env=production with full caching', function () {
            envCase({env: 'production'}, true, true, true);
        });

        it('should initialize env=development without load/exec caching', function () {
            envCase({env: 'development'}, true, false, false);
        });

        it('should initialize env=production + {make: false} without make caching', function () {
            envCase({env: 'production', cache: {make: false}}, false, true, true);
        });

        it('should initialize env=development + {make: true} with make caching', function () {
            envCase({env: 'development', cache: {make: true}}, true, false, false);
        });
    });

    describe('with env variables', function () {
        it('NODE_ENV="development" expects no load/exec cache', function () {
            envCase({processEnv: {NODE_ENV: 'development'}}, true, false, false);
        });

        it('NODE_ENV="production" expects full caching', function () {
            envCase({processEnv: {NODE_ENV: 'production'}}, true, true, true);
        });

        it('EXPRESS_BEM_CACHE=YES expects full caching', function () {
            envCase({processEnv: {EXPRESS_BEM_CACHE: 'YES'}}, true, true, true);
        });

        it('EXPRESS_BEM_CACHE=YES should init {make:false} without make caching', function () {
            envCase({processEnv: {EXPRESS_BEM_CACHE: 'YES'}, cache: {make: false}}, false, true, true);
        });

        it('EXPRESS_BEM_CACHE_MAKE=YES should init {make:false} without make caching', function () {
            envCase({processEnv: {EXPRESS_BEM_CACHE_MAKE: 'YES'}, cache: {make: false}}, false, false, false);
        });
    });

    function envCase (opts, make, load, exec) {
        var origProcessEnv = process.env;
        process.env = opts.processEnv || {};
        delete opts.processEnv;

        var expressBem = EXPRESSBEM(opts);

        ASSERT.equal(JSON.stringify({
            make : expressBem.envMakeCache,
            load : expressBem.envLoadCache,
            exec : expressBem.envExecCache
        }), JSON.stringify({
            make : make,
            load : load,
            exec : exec
        }));

        process.env = origProcessEnv;
    }

});
