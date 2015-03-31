var express     = require('express'),
    ns          = require('express-namespace'),
    bp          = require('body-parser'),
    mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    app         = module.exports.app = express(),
    http        = require('http').Server(app),
    yaml        = require('js-yaml'),
    fs          = require('fs'),
    compression = require('compression'),
    should      = require('chai').should(),
    request     = require('request');

var doc = yaml.safeLoad(fs.readFileSync('./src/database.yml', 'utf8'));
var currentEnv = process.env.NODE_ENV || "test";

mongoose.connect(doc.database[currentEnv].url);

db = mongoose.connection;

db.on('error', function() {

});

// logger = function(req, res, next) {
//   console.log("#{req.method} #{req.url}");
//   if (req.method != "GET") {
//     console.log(JSON.stringify(req.body));
//   }
//   next();
// }

requireAdmin = function(req, res, next) {
}


// app.use(logger);

var doc = yaml.safeLoad(fs.readFileSync('./src/database.yml', 'utf8'));
var currentEnv = "test";
// app.get("/", function(req, res) {
//   res.send({"hello": doc.database[currentEnv]});
// });

var User;
var db;
var newUser;
var validUser;
var userController;

describe('User controller', function() {
  // this.timeout(15000);
  before(function(done) {
    done();
  });

  beforeEach(function(done) {
    // db = mongoose.connection;
    if (!User) {
      db = mongoose.createConnection(doc.database["development"].url);
      db.once("open", function() {
        var makeUser = require("../../src/model/user.js");
        User = makeUser(mongoose, mongoose.Schema);
        newUser = new User();
        validUser = new User();
        validUser.name = "Valid Name";
        validUser.userName = "longusername";
        validUser.facebookId = "10155392507670475";
        // console.log("Instantiated Tests...");
        return done();
      });
    } else {
      newUser = new User();
      validUser = new User();
      validUser.name = "Valid Name";
      validUser.userName = "longusername";
      validUser.facebookId = "10155392507670476";
      // console.log("Again, I am in the before Each");
      User.remove({}, function(err) {
        return done();

      });
    };
  });
  afterEach(function(done) {
    User.remove({}, function(err) {
      return done();
    });
  });
  after(function(done) {
    // mongoose.connection.models = {};
    mongoose.connection.db.dropDatabase();
    db.close();
    // console.log("Done! ");
    done();
  });
  describe('the user routes', function() {
    describe('/api', function() {
      describe('/v1', function() {
        describe('/users', function() {
          describe('POST /', function() {
            it('should make a new user in the database if a valid user is there', function(done) {
              validUser.save(function(err) {
                var options = {
                            uri: 'http://localhost:4004/api/v1/users',
                            method: 'POST',
                            json: {
                              "user": {
                                "name": "Ben Juju Bayard",
                                "username": "partyfists",
                                "facebookId": 10155392507670475
                              }
                            }
                          };
                request(options, function(err, response, body) {
                  response.statusCode.should.equal(201);
                  return done();
                });
              });
            });
            it('should not make a new user in the database if the user is invalid', function(done) {
              validUser.save(function(err) {
                var options = {
                            uri: 'http://localhost:4004/api/v1/users',
                            method: 'POST',
                            json: {
                              "user": {
                                "name": "Ben Juju Bayard",
                                "username": "--",
                                "facebookId": 10155392507670475
                              }
                            }
                          };

                request(options, function(err, response, body) {
                  response.statusCode.should.equal(422);
                  return done();
                });
              });
            });
          });
        });
        describe('/users/:username', function() {
          describe("PUT /", function() {
            it('should send a 401 if no token is supplied', function(done) {
              validUser.save(function(err) {
                var options = {
                            uri: 'http://localhost:4004/api/v1/users/' + validUser.userName,
                            method: 'PUT',
                            json: {
                              "user": {}
                            }
                          };
                // console.log(options.uri);
                request(options, function(err, response, body) {
                  // console.log(body);
                  response.statusCode.should.equal(401);
                  return done();
                });
              });
            });
          });
        })
      });
    });
  });
});
