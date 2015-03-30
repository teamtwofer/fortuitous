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
    }
  });
  userSchema.pre('save', function(next){
    this.userName = this.userName.toLowerCase();
    this.name = this.name.trim();
    next();
  });
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
