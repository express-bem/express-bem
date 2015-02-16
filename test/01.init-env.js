
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
            envCase(undefined, false, false);
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

        it('EXPRESS_BEM_CACHE_LOAD=YES expects load caching', function () {
            envCase({processEnv: {EXPRESS_BEM_CACHE_LOAD: 'YES'}}, true, false);
        });

        it('EXPRESS_BEM_CACHE_EXEC=NO expects no load cache', function () {
            envCase({processEnv: {EXPRESS_BEM_CACHE_EXEC: 'YES'}}, false, true);
        });

        it('NODE_ENV=production and EXPRESS_BEM_CACHE_LOAD=YES expects full caching', function () {
            envCase({processEnv: {NODE_ENV: 'production', EXPRESS_BEM_CACHE_LOAD: 'NO'}}, false, true);
        });

        it('NODE_ENV=production and EXPRESS_BEM_CACHE_EXEC=YES expects full caching', function () {
            envCase({processEnv: {NODE_ENV: 'production', EXPRESS_BEM_CACHE_EXEC: 'NO'}}, true, false);
        });
    });

    describe('with both env and opts', function () {
        it('should use opts instead of env', function () {
            envCase({cache: {load: true}, processEnv: {EXPRESS_BEM_CACHE_LOAD: 'NO'}}, true, false);
            envCase({cache: {load: false}, processEnv: {EXPRESS_BEM_CACHE_LOAD: 'YES'}}, false, false);
            envCase({cache: {exec: true}, processEnv: {EXPRESS_BEM_CACHE_EXEC: 'NO'}}, false, true);
            envCase({cache: {exec: false}, processEnv: {EXPRESS_BEM_CACHE_EXEC: 'YES'}}, false, false);
        });
    });

    function envCase (opts, load, exec) {
        var origProcessEnv = process.env;
        process.env = (opts || {}).processEnv || {};
        if (opts && opts.processEnv) {
            delete opts.processEnv;
        }

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
