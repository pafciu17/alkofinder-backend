var MongoClient = require('mongodb').MongoClient,
    Promise = require('promise');

var mongoDbUrl = 'mongodb://127.0.0.1:27017/stores';

function DBConnectionManager() {
    this.db = null;
};

DBConnectionManager.prototype.connect = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        MongoClient.connect(mongoDbUrl, function(err, db) {
            if (err) {
                reject(err)
            } else {
                self.db = db;
                resolve(self.db);
            }
        });
    });
};

DBConnectionManager.prototype.getDB = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (self.db) {
            resolve(self.db);
        } else {
            resolve(self.connect());
        }
    });
};

DBConnectionManager.prototype.close = function() {
    if (this.db) {
        this.db.close();
    }
};

module.exports = new DBConnectionManager();