// "first_name" = Ben;
// gender = male;
// id = 10155392507670475;
// "last_name" = Bayard;
// link = "https://www.facebook.com/app_scoped_user_id/10155392507670475/";
// locale = "en_US";
// "middle_name" = Juju;
// name = "Ben Juju Bayard";
// timezone = "-7";
// "updated_time" = "2015-02-25T04:01:22+0000";
// verified = 1;

var jwt = require('jsonwebtoken');

var secret = "Oh lala miss seor penguin pants";

module.exports = function(mongoose, Schema) {
  userSchema = mongoose.Schema({
    name: {
      type: String,
      default: ""
    },
    userName: {
      type: String,
      default: "",
      unique: true
    },
    facebookId: {
      type: String,
      required: true,
      unique: true
    }
  });
  userSchema.pre('save', function(next){
    this.userName = this.userName.toLowerCase();
    this.name = this.name.trim();
    next();
  });

  userSchema.methods.makeToken = function() {
    var newToken = jwt.sign({"id": this.id}, secret);

    return newToken;
  };

  userSchema.statics.forToken = function(token, callback) {
    // console.log(secret);
    // console.log(token);
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        // console.log(err);
        callback(err, null);
      } else {
        User.findById(decoded.id, function(err, user) {
          callback(err, user);
        });
      }
    });
  };

  userSchema.statics.findByFacebookId = function(facebookId, callback) {
    return this.findOne({facebookId: facebookId}, callback);
  };

  userSchema.path('name').validate(function (v) {
    return v.length > 8;
  }, 'Name is not long enough');

  userSchema.path('userName').validate(function(v) {
    return v.length > 6;
  }, 'Username is not long enough');

  userSchema.path('name').validate(function (v) {
    return /\w+\s+\w+/.test(v);
  }, 'You must have a first and last name separated by a space');

  userSchema.path('userName').validate(function(v) {
    return !/\s/.test(v);
  }, 'Username cannot contain a space');

  var User = mongoose.model('User', userSchema);
  return User;
}
