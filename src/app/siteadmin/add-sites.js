angular.module('ngBoilerplate.site.addSite', [
    'ui.router',
    'ngMaterial'
])

.config(function config($stateProvider) {
    $stateProvider.state('addSite', {
        url: '/addSite/:id ? title',
        params: {
            id: null,
            title: null,
            hiddenParam: 'YES'
        },
        views: {
            "main": {
                controller: 'addSiteCtrl',
                templateUrl: 'siteadmin/add-site.tpl.html'
            }
        },
        data: {
            pageTitle: 'addSite'
        }
    })


})

.controller('addSiteCtrl', function ($scope, $state, $stateParams, siteService, $mdDialog) {
        var id = $stateParams.id;
        $scope.title = $stateParams.title;
     $scope.currentUser = Parse.User.current();
     $scope.c_id=$scope.currentUser.id;
        $scope.save = function(site) {
            siteService.saveSitedetails(site, $scope.c_id, function(res, error) {
                if (error) {
                    console.log(error);
                    showAlert("Unable to save:  " + error.code + " " + error.message);

                } else {

                    console.log(res);
                    $scope.site = res;
                    showAlert("Successfully created the Customer")
                        // $state.go('customers')
                }

            });
        };
       
        siteService.getSite(id, function(res, error) {
            if (error) {
                showAlert("Error occured while deleting");
            } else {
                if (res['attributes']) {
                    $scope.site = res['attributes'];
                    console.log(res['attributes']);
                    $scope.$digest();
                }
            }
        });

        $scope.edit = function(site) {

            siteService.editSitedetails(id, site, function(res, error) {
                if (error) {
                    showAlert("Error occured while deleting");
                } else {
                    console.log(res);
                    showAlert("Update was successful")
                }
            });
        }
        $scope.cancel = function(){

        	$state.go('site');
        }
        function showAlert(content) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .content(content)
                .ariaLabel('Alert Dialog')
                .ok('OK')
            );
        }

    })
    .factory('siteService', function() {
        return {

            saveSitedetails: function(newsite,id, cb) {
                // debugger
                var Site = Parse.Object.extend("Site");
                var site = new Site();
                site.set("name", newsite.name);
                site.set("Service_address", newsite.Service_address);
                site.set("Contact_person", newsite.Contact_person);
                site.set("Contact_ph", newsite.Contact_ph);
                site.set("Contact_email", newsite.Contact_email);
                site.set("Site_no", newsite.Site_no);
                site.set("Information", newsite.Information);
                site.set("Invoice_date", newsite.Invoice_date);
                site.set("GST", newsite.GST);
                site.set("PO_ref", newsite.PO_ref);
                site.set("admin_id",id)
                site.save(null, {
                    success: function(res) {
                        return cb(res);
                    },
                    error: function(error) {
                        console.log(error);
                        return cb(null, error);
                    }
                });
            },
            get: function(id,cb) {
                var site = Parse.Object.extend("Site");
                var queryObject = new Parse.Query(site);
                queryObject.equalTo("admin_id", id);
                queryObject.find({
                    success: function(results) {
                        return cb(results);

                    },
                    error: function(error) {
                        return cb(null, error);
                    }
                });
            },
            deleteSite: function(id, cb) {

                var Site = Parse.Object.extend("Site");
                var query = new Parse.Query(Site);

                query.get(id, {
                    success: function(res) {
                        res.destroy({});
                        return cb("success");
                    },
                    error: function(object, error) {
                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                        return cb(null, error);
                    }
                });
            },
            getSite: function(id, cb) {
                var Site = Parse.Object.extend("Site");
                var query = new Parse.Query(Site);

                query.get(id, {
                    success: function(results) {
                        return cb(results);

                    },
                    error: function(error) {
                        return cb(null, error);
                    }
                });
            },
            editSitedetails: function(id, newsite, cb) {
                // debugger
                var Site = Parse.Object.extend("Site");
                var query = new Parse.Query(Site);
                query.get(id, {
                    success: function(results) {
                        results.set("name", newsite.name);
                        results.set("Service_address", newsite.Service_address);
                        results.set("Contact_person", newsite.Contact_person);
                        results.set("Contact_ph", newsite.Contact_ph);
                        results.set("Contact_email", newsite.Contact_email);
                        results.set("Site_no", newsite.Site_no);
                        results.set("Information", newsite.Information);
                        results.set("Invoice_date", newsite.Invoice_date);
                        results.set("GST", newsite.GST);
                        results.set("PO_ref", newsite.PO_ref);
                        results.save(null, {
                            success: function(res) {
                                return cb(res);
                            },
                            error: function(error) {
                                console.log(error);
                                return cb(null, error);
                            }
                        });
                    },
                    error: function(error) {
                        return cb(null, error);
                    }
                });
            }
        };
    });
