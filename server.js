var StoreServer = require('./src/StoreServer');

var storeServer = new StoreServer();
storeServer.init({port:3001}).then(function() {
    console.log('listens');
});
