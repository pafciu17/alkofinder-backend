var express = require('express'),
    Promise = require('promise'),
    StoreStorage = require('./StoreStorage'),
    dbConnectionManager = require('./DBConnectionManager');

function StoreServer(){};

StoreServer.prototype._prepareStorage = function() {
    var self = this;
    self.storeStorage = new StoreStorage;
    return dbConnectionManager.getDB().then(function(db) {
        return self.storeStorage.init(db);
    });
};

StoreServer.prototype._setRouting = function() {
    var self = this;
    self.app.get('/', function(req, res) {
        self.storeStorage.get().then(function(stores) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(stores);
        });
    });
};

StoreServer.prototype._startServer = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.server = self.app.listen(self.conf.port, function() {
            resolve(self.server);
        });
    });
};

StoreServer.prototype.init = function(conf) {
    var self = this;
    self.app = express();
    self.conf = conf;
    return self._prepareStorage().then(function() {
        self._setRouting();
        return self._startServer();
    });
};

module.exports = StoreServer