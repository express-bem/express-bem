module.exports = {
    engines : [{
        render    : function (name, options, cb) {
            cb(null, options);
        },
        extension : '.test-plugin'
    }]
};
