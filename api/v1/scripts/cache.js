const cache = require("memory-cache");

module.exports = {
    add: function (key, data) {
        cache.put(key, data);
    },
    get: function (key){
        return cache.get(key);
    }
}