var Promise = require('promise'),
    StoreStorage = require('../src/StoreStorage'),
    AlkoStoreBackend = require('../src/AlkoStoreBackend'),
    GoogleGeocoderApi = require('../src/GoogleGeocoderApi'),
    dbConnectionManager = require('../src/DBConnectionManager');

var alkoStoreBackend = new AlkoStoreBackend(),
    storeStorage = new StoreStorage();

dbConnectionManager.getDB().then(function(db) {
    return storeStorage.init(db)
}).then(function() {
    return alkoStoreBackend.fetchStores()
}).then(function(stores){
    var insertOrUpdate = storeStorage.insertOrUpdate.bind(storeStorage);
    return Promise.all(stores.map(insertOrUpdate));
}).then(function() {
    dbConnectionManager.close();
});


