
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.afterSave(Parse.User, function(request) {
Parse.Cloud.useMasterKey();  

  query = new Parse.Query(Parse.Role);
  var roles=request.object.get('role');
  query.equalTo("name", roles);
  query.first ( {
    success: function(object) {
      object.relation("users").add(request.user);
      object.save();
    },
    error: function(error) {
      throw "Got an error " + error.code + " : " + error.message;
    }
  });
});