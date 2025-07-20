const { MongoClient } = require("mongodb");
const _uri = process.env.URI;

const dbConnection = (collection, cb) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(_uri)
      .then(async (client) => {
        try {
          const db = client.db(process.env.DBN).collection(collection);
          const result = await cb(db); 
          client.close();
          resolve(result); 
        } catch (err) {
          client.close();
          reject(err);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = dbConnection;
