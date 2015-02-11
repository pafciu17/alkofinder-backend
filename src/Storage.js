var MongoClient = require('mongodb').MongoClient,
    Promise = require('promise');

Storage = function() {
};

Storage.prototype._prepareConnection = function(db, collectionName) {
    this.db = db;
    this.collection = this.db.collection(collectionName);
    var self = this;
    return new Promise(function(resolve, reject) {
        self.collection.ensureIndex({ Name: 1 }, { unique: true }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

Storage.prototype.init = function(mongoDbUrl, collectionName) {
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

Storage.prototype.removeAll = function() {
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

Storage.prototype.insertOrUpdate = function(item) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.collection.update({ Name: item.Name },
            {
                $set: item,
                $currentDate: {
                    lastModified: { $type: "timestamp" }
                }
            }, {
                upsert: true,
                w: 1
            }, function(err, results) {
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        });
    });
};

Storage.prototype.get = function(searchCondition) {
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

module.exports = Storage;