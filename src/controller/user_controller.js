module.exports = function(mongoose, Schema) {
  User = require("../model/user.js")(mongoose, Schema);

  return {
    index: function(req, res) {
      res.send({"user": "what"});
    },
    new: function(req, res) {
      res.send({"user": new User()});
    },
    create: function(req, res) {
      var userToMake = req.body.user;
      console.log("usertomake: ");
      console.log(userToMake);
      var newUser = new User({
        name: userToMake.name,
        facebookId: userToMake.facebookId,
        userName: userToMake.username
      });

      newUser.save(function(error, user) {
        console.log("Error: ")
        console.log(error);
        if (error) {
          // send invalid user response
          res.status(422).send(error).end();
        } else {
          res.status(201).send(user).end();
        }
      });
    },
    update: function(req, res) {

    },
    requireAuth: function(req, res, next) {
      User.forToken(req.headers.authorization, function(err, user) {
        if(req.params.username && !err && user && req.params.username === user.userName) {
          next();
        } else {
          res.status(401).end();
        }
      });
    }
  };
};
