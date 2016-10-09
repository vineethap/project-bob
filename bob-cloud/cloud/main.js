// Use Parse.Cloud.define to define as many cloud functions as you want.
Parse.Cloud.afterSave(Parse.User, function(request) {
    Parse.Cloud.useMasterKey();
    if (request.object.get('createdAt').getTime() == request.object.get('updatedAt').getTime()) {
        var id = request.user.id;
        query = new Parse.Query(Parse.Role);
        var roles = request.object.get('role');
        if (roles == "Siteadmin") {
            query.equalTo("name", roles);
            query.first({
                success: function(res) {
                    var user = request.user;
                    testrole = roles + id;
                    techieRole = "Technician-" + id;
                    console.log("role", testrole);
                    var publicReadACL = new Parse.ACL();
                    publicReadACL.setPublicReadAccess(true);
                    publicReadACL.setWriteAccess(testrole, true);
                    publicReadACL.setWriteAccess("Superadmin", true);

                    var newRole = new Parse.Role(testrole, publicReadACL);
                    var techie = new Parse.Role(techieRole, publicReadACL);
                    newRole.save().then(function() {

                        console.log("successfully created a role")
                    })
                    techie.save().then(function() {
                        console.log("successfully created a role")
                    })
                    newRole.relation("users").add(request.user);
                    newRole.save();
                    console.log("Successfully updated roles on first save");

                },
                error: function(error) {
                    console.error(error.message);
                }
            });
        } else {
            query.equalTo("name", roles);
            query.first({
                success: function(object) {
                    object.relation("users").add(request.user);
                    object.save();
                    console.log("Successfully updated roles on first save");

                },
                error: function(error) {
                    console.error(error.message);
                }
            })
        }
    } else {
        console.log("Not updating..");
    }

});

Parse.Cloud.define('deleteUser', function(request, response) {
    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(Parse.User);

    query.get(request.params.id, {
        success: function(user) {
            user.destroy({
                success: function() {
                    response.success('User deleted');
                },
                error: function(error) {
                    console.log(error);
                    response.error(error);
                }
            });
        },
        error: function(error) {

            response.error(error);
        }
    });
});

Parse.Cloud.define('editUser', function(request, response) {
    Parse.Cloud.useMasterKey();
    console.log("expecting..");
    console.log(request.params.id);

    var query = new Parse.Query(Parse.User);
    query.get(request.params.id, {
        success: function(user) {
            user.set("email", request.params.email);
            user.set("company_name", request.params.company_name);
            user.set("username", request.params.username);
            user.set("address_detail", request.params.address_detail);
            user.set("state", request.params.state);
            user.set("postalcode", request.params.postalcode);
            user.set("ABN", request.params.ABN);
            user.set("fax", request.params.fax);
            user.set("contact_no", request.params.contact_no);
            user.set("website", request.params.website);
            user.set("member_amount", request.params.member_amount);
            user.set("member_billdate", request.params.member_billdate);
            user.set("member_balance", request.params.member_balance);

            user.save(null, {
                success: function(user) {
                    // The user was saved successfully.
                    console.log("user", user);
                    response.success("Successfully updated user.", user);
                },
                error: function(user, error) {
                    // The save failed.
                    // error is a Parse.Error with an error code and description.
                    response.error("Could not save changes to user.");
                }
            });
        },

        error: function(error) {
            response.error(error);
        }
    });
})

var Item = Parse.Object.extend("Item");
Parse.Cloud.beforeSave("Item", function(request, response) {
    if (!request.object.get("Item_code")) {
        response.error('A Item must have a itemcode.');
    } else {
        var query = new Parse.Query(Item);
        query.equalTo("Item_code", request.object.get("Item_code"));
        query.first({
            success: function(object) {
                if (object) {
                    response.error("A item with this itemcode already exists.");
                } else {
                    response.success();
                }
            },
            error: function(error) {
                response.error("Could not validate uniqueness for this item object.");
            }
        });
    }
});

Parse.Cloud.define("addSite", function(request, response) {
    Parse.Cloud.useMasterKey();
    var newuser = new Parse.User();
    var siteOne = new Parse.Object("Site");
    var query = new Parse.Query(Parse.User);
    query.get(request.params.id, {
        success: function(users) {
            siteOne.set("name", request.params.name);
            siteOne.set("Site_no", request.params.Site_no);
            siteOne.set("Service_address", request.params.Service_address);
            siteOne.save({
                success: function(res) {
                    var relation = users.relation("sites");
                    relation.add(siteOne);
                    users.set("username", request.params.techie_name);
                    users.set("C_num", request.params.techie_no);
                    users.save(null, {
                        success: function() {
                            console.log("sites added to  ");
                            response.success("success");
                        },
                        error: function(err) {
                            console.log(err);
                            response.error("Unable to add sites");
                        }
                    });

                },
                error: function(err) {
                    console.log("site not found : " + err.code);
                    response.error("site not found.");
                }
            });
        },
        error: function(err) {
            console.log("user not found: " + err.code);
            response.error("user not found");
        }
    });
});

Parse.Cloud.define("addtechie", function(request, response) {
    Parse.Cloud.useMasterKey();
    var site = Parse.Object.extend("Site")
    var query = new Parse.Query(site);
    var userOne = new Parse.User();
    query.get(request.params.id, {
        success: function(sites) {
            console.log("sites", sites)
            userOne.set("username", request.params.username);
            userOne.set("contact_no", request.params.contact_no);
            userOne.set("C_num", request.params.C_num);
            userOne.save({
                success: function(res) {
                    var relation = sites.relation("techies");
                    relation.add(userOne);
                    sites.set("name", request.params.name);
                    sites.set("Site_no", request.params.Site_no);
                    sites.save(null, {
                        success: function() {
                            console.log("users added to  ");
                            response.success("success");
                        },
                        error: function(err) {
                            console.log(err);
                            response.error("Unable to add users");
                        }
                    });

                },
                error: function(err) {
                    console.log("site not found : " + err.code);
                    response.error("unable to save.");
                }
            });
        },
        error: function(err) {
            console.log("site not found: " + err.code);
            response.error("site not found");
        }
    });
});

Parse.Cloud.define('updateUser', function(request, response) {
    Parse.Cloud.useMasterKey();
    console.log(request.params.id);
    console.log("onject", request.params)
    var siteOne = new Parse.Object("Site");

    var query = new Parse.Query(Parse.User);
    query.get(request.params.id, {
        success: function(user) {
            user.set("username", request.params.techie_name);
            user.set("C_num", request.params.C_num);
            user.set("sites.Site_no", request.params.Site_no);
            user.set("sites.name", request.params.name);
            user.save(null, {
                success: function(user) {
                    console.log("user", user);
                    response.success("Successfully updated user.", user);
                },
                error: function(user, error) {
                    response.error("Could not save changes to user.");
                }
            });
        },

        error: function(error) {
            response.error(error);
        }
    });
})
