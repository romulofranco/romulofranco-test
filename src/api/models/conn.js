const { MongoClient } = require('mongodb');

// eslint-disable-next-line max-len
// const URI = 'mongodb+srv://romulo:987321@cluster0.doltv.mongodb.net/Cookmaster';

const URI = 'mongodb://mongodb:27017';

let db = null;
let conn = null;

const connection = async () => {
  if (db) return db;
  try {
    conn = await MongoClient.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    db = conn.db('Cookmaster');
    return db;
  } catch (error) {
    console.log(error.message);
    process.exit(0);
  }
};

const close = () => {
  if (conn) {
    conn.close();
    db = null;
    conn = null;
  }
};

module.exports = {
  connection,
  close,
};
