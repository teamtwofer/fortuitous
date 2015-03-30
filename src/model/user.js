module.exports = function(mongoose, Schema) {
  console.log("What?");
  userSchema = mongoose.Schema({
    name: { 
      type: String, 
      default: "" 
    }
  });
  userSchema.path('name').validate(function (v) {
    return v.length > 8;
  }, 'Name is not long enough');
  return mongoose.model('User', userSchema);
}