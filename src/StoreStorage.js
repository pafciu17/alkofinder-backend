var MongoClient = require('mongodb').MongoClient,
    Promise = require('promise');

var mongoDbUrl = 'mongodb://127.0.0.1:27017/test',
    collectionName = 'stores';

function StoreStorage() {
};

StoreStorage.prototype._prepareConnection = function(db, collectionName) {
    this.db = db;
    this.collection = this.db.collection(collectionName);
    var self = this;
    return new Promise(function(resolve, reject) {
        self.collection.ensureIndex({ Address: 1 }, { unique: true }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

StoreStorage.prototype.init = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        MongoClient.connect(mongoDbUrl, function(err, db) {
            if (err) {
                reject(err)
            } else {
                self._prepareConnection(db, collectionName).then(function() {
                    resolve();
                });
            }
        });
    });
};

StoreStorage.prototype.removeAll = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.collection.remove({}, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

StoreStorage.prototype.insertOrUpdate = function(item) {
    var self = this;
    return new Promise(function(resolve, reject) {
        delete item.lastModified;
        self.collection.update({ Address: item.Address },
            {
                $set: item,
                $currentDate: {
                    lastModified: { $type: "timestamp" }
                }
            }, {
                upsert: true,
                w: 1
            },
            function(err, results) {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            }
        );
    });
};

StoreStorage.prototype.get = function(searchCondition) {
    var self = this;
    searchCondition = searchCondition || {};
    return new Promise(function(resolve, reject) {
        self.collection.find(searchCondition).toArray(function(err, items) {
            if (err) {
                reject(err);
            } else {
                resolve(items);
            }
        });
    });
}

module.exports = StoreStorage;