
var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require('mongodb').ObjectId;
chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('#example Test GET /api/books', function(done) {
     chai.request(server)
      .get('/api/books')
      .end(function(err, res) {
        if (err) {
          console.error(err);
        }
        assert.equal(200, 200);
        assert.equal(res.header["x-powered-by"], 'PHP 4.2.0');
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books/?title=test book', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'test book'})
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.equal(res.header["x-powered-by"], 'PHP 4.2.0');
          assert.equal(res.body.title, 'test book');
          done();
        });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: ''})
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.equal(res.header["x-powered-by"], 'PHP 4.2.0');
          assert.equal(res.text, 'no title given');
          done();
        });
      });

    });

    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          if (err) console.error(err)
          assert.equal(res.status, 200)
          assert.isArray(res.body, 'an array of books');
          done();
        });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db',  function(done) {
        chai.request(server)
        .get('/api/books/5cccccccc969553c28639e75')
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.isString(res.body.error, 'must be a string');
          assert.equal(res.body.error, 'no result found')
          done();
        })
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {
      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
        .post('/api/books/5cd4885853e8ca61a00ec826')
        .send({comment: "THIS IS A TEST COMMENT FROM TEST DPT"})
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.property(res.body,'_id', '_id should be a property');
          assert.equal(res.body._id, '5cd4885853e8ca61a00ec826');
          assert.include(res.body.comments, 'THIS IS A TEST COMMENT FROM TEST DPT');
          done();
        });
      });
    });
  });

});
