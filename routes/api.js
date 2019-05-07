
'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId
var Handle = require('../controller/handle.js');
const dotenv = require('dotenv');
dotenv.config();
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db)
module.exports = function (app) {
const MONGODB_CONNECTION_STRING = process.env.DB;
  app.route('/api/books/') //api/books
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) console.error(err);
          try {
          db.collection('library').find({}).toArray((err, results) => {
            if (err) console.error(err);
            if (results) {
              var lib;
              console.log(results)
              res.json(results.map(r => {
                return {'_id': r._id, 'title': r.title,
                'comments': r.comments,
                 'commentcount': r.comments.length};
              }));
            }
          });
        } finally {
          db.close();
        }
        });
      }
      catch (e) {
        console.error(e);
      }
      // res.json({});
    })
    .post(function (req, res) {
      var title = req.body.title;
      console.info("POST   ")
      try {
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) console.error(err);
          try {
            db.collection('library').insertOne(
              {title: title, comments: []}, function(err, r) {
                if (err) console.error(err);
                console.info("BOOK ADDED!")
                res.json({title, id: req.body._id})
              });
          }
          finally {
            db.close();
          }
        })
      }
      catch (e) {
        console.error(e);
      }

      //response will contain new book object including atleast _id and title
    })


    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.info("'/api/books/:id'");
      var id = req.params.id;
      var handle = new Handle();
        handle.getResultFromDB(id)
      .then(function(data) {
        if (data) {
          console.info("GET::if (value) {")
          console.log(data)
          res.json(data);
        }
        else res.json({error: 'no result found'})
      })
      .catch(function(e) {
        console.error(e);
      });
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      console.log("PARAMS")
      console.log(req.params)
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        if (err) console.error(err);
        console.log("ObjectId(bookid)")
        console.log(bookid)
        db.collection('library').updateOne(
          {_id: ObjectId(bookid)}, {$push: {comments: comment}}
        );
        db.collection('library').findOne({_id: ObjectId(bookid)}, function(err, data) {
          if (err) console.error(err);
          if (data) {
            res.json(data)
          }
        })
      });
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        if (err) console.error(err);
        try {
          db.collection('library').deleteOne({_id: ObjectId(bookid)});
          res.send('delete successful');
        }
        catch (e) {
          console.error(e);
        }
      });
    });

};
