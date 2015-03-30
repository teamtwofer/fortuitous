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

db.on('error', console.error.bind(console, 'connection error:'));

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
mongoose.connect(doc.database[currentEnv].url);

db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

  describe('User', function() {
    describe('validate user name validation', function() {
      // console.log(mongoose);
      // console.log(Schema);
      console.log(doc.database[currentEnv].url);
      var User = require("../../src/model/user.js")(mongoose, Schema);
      // var user = new User();
      // user.save(function(err) {
      //   err.should.not.be.null();
      //   done();
      // });
    });
  });
});
