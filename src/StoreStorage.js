var Promise = require('promise');

var collectionName = 'stores';
function StoreStorage() {
};

StoreStorage.prototype._prepareCollection = function(collectionName) {
    var self = this;
    self.collection = self.db.collection(collectionName);
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

StoreStorage.prototype.init = function(db) {
    var self = this;
    self.db = db;
    return new Promise(function(resolve, reject) {
        resolve(self._prepareCollection(collectionName));
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
        self.collection.update({ Name: item.Name },
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
                    console.log('err');
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
                console.log(err);
                reject(err);
            } else {
                resolve(items);
            }
        });
    });
}

module.exports = StoreStorage;