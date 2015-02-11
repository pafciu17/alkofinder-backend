var Storage = require('./src/Storage'),
    AlkoStoreBackend = require('./src/AlkoStoreBackend');

var alkoStoreBackend = new AlkoStoreBackend();

var storeStorage = new Storage();
storeStorage.init('mongodb://127.0.0.1:27017/test', 'stores').then(function() {
    alkoStoreBackend.fetchStores().then(function(stores){
        stores.forEach(function(store) {
            storeStorage.insertOrUpdate(store);
        });
    });
});

