var request = require('request-json'),
    Promise = require('promise');

var client = request.createClient('https://maps.googleapis.com/');

function GoogleGeocoderApi(){};

GoogleGeocoderApi.prototype._deriveCoordinates = function(body) {
    if (!body || !body.results || !body.results[0] || !body.results[0].geometry || !body.results[0].geometry.location) {
        return null;
    }
    return body.results[0].geometry.location;
};

GoogleGeocoderApi.prototype.getCoordinatesByAddress = function(address) {
    var self = this;
    return new Promise(function(resolve, reject) {
        client.get('maps/api/geocode/json?address=' + address, function(err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(self._deriveCoordinates(body));
            }
        });
    });
};

module.exports = GoogleGeocoderApi;
