var Promise = require('promise'),
    StoreStorage = require('../src/StoreStorage'),
    dbConnectionManager = require('../src/DBConnectionManager'),
    GoogleGeocoderApi = require('../src/GoogleGeocoderApi');

var storeStorage = new StoreStorage(),
    googleGeocoderApi = new GoogleGeocoderApi();

dbConnectionManager.getDB().then(function(db) {
    return storeStorage.init(db);
}).then(function() {
    return storeStorage.get({lng: {$exists: false}, lat: {$exists: false}});
}).then(function(stores) {
    return Promise.all(stores.map(updateStoreCoordinates));
}).then(function() {
    dbConnectionManager.close();
}, function(err) {
    console.log('Err: ' + err);
    dbConnectionManager.close();
});

var delay = 0,
    delayDelta = 500;
var updateStoreCoordinates = function(store) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            googleGeocoderApi.getCoordinatesByAddress(store.Address).then(function(coords) {
                if (coords) {
                    store.lng = coords.lng;
                    store.lat = coords.lat;
                    resolve(storeStorage.insertOrUpdate(store));
                } else {
                    resolve();
                }
            });
        }, delay);
        delay += delayDelta;
    });
};


