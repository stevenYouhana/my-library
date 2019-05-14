

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_CONNECTION_STRING = process.env.DB

class Handle {
  constructor() {
    this.resobj = null;
  }

  getResultFromDB(id) {
    return new Promise((result, reject) => {
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        try {
          if (err) console.error(err);
          db.collection('library').findOne(
            {_id: ObjectId(id)}, (err, data) => {
            if (err) console.error(err);
            if (data) {
              this.resobj = {
                id: data._id,
                title: data.title,
                commentcount: data.comments ? data.comments.length : 0
              };
              result(this.resobj);
            }
            else reject(new Error('No result found!'));
          });
        }
        catch (e) {
          console.error(e);
        }
        finally {
          db.close();
        }
      });
    });
  }
}

module.exports = Handle;
