var request = require('request-json'),
    Promise = require('promise');

var client = request.createClient('http://www.alko.fi/');

function AlkoStoreBackend() {};

AlkoStoreBackend.prototype._isValidResult = function(stores) {
    return stores && stores[0] && stores[0].Name && stores[0].Address
};

AlkoStoreBackend.prototype.fetchStores = function() {
    var self = this;
    return new Promise(function(resolve, reject){
        client.get('api/find/stores?Language=en&Page=1&PageSize=500', function(err, res, body) {
            if (err) {
                reject(err);
            } else if (!self._isValidResult(body.Results)) {
                reject('invalid data format');
            } else {
                resolve(body.Results);
            }
        });
    });
};

module.exports = AlkoStoreBackend;