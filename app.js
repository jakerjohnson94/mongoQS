const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'myproject';

const insertDocs = function(db, callback) {
  const collection = db.collection('documents');

  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('We got 3 of em, dawg');
    callback(result);
  });
};

const findDocs = function(db, callback) {
  const collection = db.collection('documents');

  collection.find({ a: 3 }).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log('We found these boys');
    console.log(docs);
    callback(docs);
  });
};
const updateDoc = function(db, callback) {
  const collection = db.collection('documents');

  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Updated the doc and now field "a" is equal to 2');
    callback(result);
  });
};
const removeDoc = function(db, callback) {
  const collection = db.collection('documents');

  collection.deleteOne({ a: 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('We told the doc with a field equal to 3 to scram');
  });
};

const indexCollection = function(db, callback) {
  db.collection('documents').createIndex({ a: 1 }, null, function(err, results) {
    console.log(results);
    callback();
  });
};
MongoClient.connect(
  url,
  function(err, client) {
    assert.equal(null, err);
    console.log('Essssketiiiit');

    const db = client.db(dbName);

    insertDocs(db, function() {
      indexCollection(db, function() {
        client.close();
      });
    });
  }
);
