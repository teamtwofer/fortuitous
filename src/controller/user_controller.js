module.exports = function(mongoose, Schema) {
  User = require("../model/user.js")(mongoose, Schema);

  return {
    index: function(req, res) {
      res.send({"user": "what"});
    },
    new: function(req, res) {
      res.send({"user": new User()});
    }
  };
};