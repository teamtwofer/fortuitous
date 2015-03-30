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
    should      = require('chai').should();

var doc = yaml.safeLoad(fs.readFileSync('./src/database.yml', 'utf8'));
var currentEnv = process.env.NODE_ENV || "test";

mongoose.connect(doc.database[currentEnv].url);

db = mongoose.connection;

db.on('error', function() {

});

logger = function(req, res, next) {
  console.log("#{req.method} #{req.url}");
  if (req.method != "GET") {
    console.log(JSON.stringify(req.body));
  }
  next();
}

requireAdmin = function(req, res, next) {
}


app.use(logger);

var doc = yaml.safeLoad(fs.readFileSync('./src/database.yml', 'utf8'));
var currentEnv = "test";
// app.get("/", function(req, res) {
//   res.send({"hello": doc.database[currentEnv]});
// });

var User;
var db;
var newUser;
var validUser;

describe('User', function() {
  // this.timeout(15000);
  before(function(done) {
    done();
  });

  beforeEach(function(done) {
    // db = mongoose.connection;
    if (!User) {
      db = mongoose.createConnection(doc.database[currentEnv].url);
      db.once("open", function() {
        var makeUser = require("../../src/model/user.js");
        User = makeUser(mongoose, mongoose.Schema);
        newUser = new User();
        validUser = new User();
        validUser.name = "Valid Name";
        validUser.userName = "longusername";
        return done();
      });
    } else {
      newUser = new User();
      validUser = new User();
      validUser.name = "Valid Name";
      validUser.userName = "longusername";
      User.remove({}, function(err) {
        return done();
      });
    };
  });

  describe('validations', function() {
    describe('name', function() {
      it("should force you to put a name in", function(done) {
        var newUser = new User();
        console.log("WHAT WHAT");
        console.log(newUser);
        newUser.save(function(err){
          console.log("I am here!");
          should.exist(err);
          done();
        });
      });
      it("should require a space in the name", function(done) {
        validUser.name = "Invalidname";
        validUser.save(function(err) {
          should.exist(err);
          done();
        });
      });
      it("should trim the name", function(done) {
        validUser.name = "   Valid Name   ";
        validUser.save(function(err) {
          validUser.name.should.equal(validUser.name.trim());
          done();
        });
      });
      it("should produce an invalid user if their name is invalid after trim", function(done) {
        validUser.name = "    Inva    ";
        validUser.save(function(err) {
          should.exist(err);
          done();
        });
      });
    });
    describe('userName', function() {
      it("should always have a lowercase userName", function(done) {
        var newUser = new User();
        newUser.name = "First Last";
        newUser.userName = "ThIsIsAlLCaPs";

        newUser.save(function(err) {
          newUser.userName.should.equal(newUser.userName.toLowerCase());
          done();
        });
      });
      it("should validate that userNames are unique", function(done) {
        var newUser = new User();
        newUser.name = "First Last";
        newUser.userName = "firstUsername";
        newUser.save(function() {
          var secondUser = new User();
          secondUser.name = "First Last";
          secondUser.userName = newUser.userName;
          secondUser.save(function(err) {
            should.exist(err);
            done();
          });
        });
      });
      it("should not allow spaces in a userName", function(done) {
        var newUser = new User();
        newUser.name = "First Last";
        newUser.userName = "User With Space";
        newUser.save(function(err) {
          should.exist(err);
          done();
        });
      });
      it("should validate the length", function(done) {
          validUser.userName = "small";
          validUser.save(function(e) {
            should.exist(e);
            done();
          });
      });
    });


  });
});
