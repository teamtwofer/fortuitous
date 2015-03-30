var express     = require('express'),
    ns          = require('express-namespace'),
    bp          = require('body-parser'),
    mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    app         = module.exports.app = express(),
    http        = require('http').Server(app),
    yaml        = require('js-yaml'),
    fs          = require('fs'),
    compression = require('compression');

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
var currentEnv = process.env.NODE_ENV || "test";
// app.get("/", function(req, res) {
//   res.send({"hello": doc.database[currentEnv]});
// });
mongoose.connect(doc.database[currentEnv].url);

db = mongoose.connection;

userController = require("./controller/user_controller.js")(mongoose, mongoose.Schema);

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  http.listen(Number(process.env.PORT || 3000), function() {
    return console.log('listening on *:' + process.env.PORT || 3000);
  });
});

app.namespace("/api", function() {
  app.namespace("/v1", function() {
    // so now to decide how to structure the app. 
    // GET  /user/new -> return blank new user object with each of their properties.
    // POST /user     -> create new user
    // GET  /user     -> return existing user with public attributes
    // GET  /user     -> return existing user with private attributes
    app.get("/user/new", userController.new);
  });
});