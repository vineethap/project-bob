angular.module('ngBoilerplate.site_techie', [
    'ui.router',
    'ngMaterial'
])

.config(function config($stateProvider) {
        $stateProvider.state('site_techie', {
            url: '/site_techie',
            views: {
                "main": {
                    controller: 'site_techieCtrl',
                    templateUrl: 'siteadmin/site-techie/site_techie.tpl.html'
                }
            },
            data: {
                pageTitle: 'Site Techies'
            }
        })


    })
.controller('site_techieCtrl', function($scope, $state, $stateParams, $mdDialog, techieService) {
        
        // $scope.sites = function() {
        //     $scope.show_site = true;
        //     $scope.show_techie = false
        // }

        // $scope.technician = function() {

        //     $scope.show_site = false;
        //     $scope.show_techie = true
        // }
        $scope.addnewsite = function() {
            $scope.addnew = true;
        }
        $scope.search = function(techie) {
            // debugger
            if ($scope.show_site == true) {
                techieService.listSitesofTechie(techie, function(res, error) {
                    if (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }else{
                      $scope.results = res[0];
                      $scope.result = res[0].id;
                      $scope.site.id =$scope.result   
                      console.log( $scope.results );
                      $scope.$digest();
                      techieService.list($scope.site.id,function(res,error){
                        if (error) {
                         alert("Error: " + error.code + " " + error.message);
                        }else{
                          $scope.response = res;
                          console.log($scope.response);
                          $scope.$digest();
                          console.log($scope.site.id);
                     }
                    })
                  }
                })
            }
            if ($scope.show_techie == true) {
              debugger
                 techieService.Sites(techie,function(res,error){
                  if (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }else{
                      console.log(res)
                      $scope.data=res[0]
                      $scope.new.id=res[0].id
                      $scope.$digest();
                    }
                 })
            console.log("simply testin")
            }
        }
        $scope.currentUser = Parse.User.current();
        console.log($scope.currentUser);
        var c_user=$scope.currentUser
       
        techieService.listSites(c_user,function(res,error){

           if (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }else{
                     
                      // $scope.site= {
                      //             "name"   : res[0].get("name"),
                      //             "Site_no": res[0].get("Site_no"),
                      //             "Service_address" : res[0].get("Service_address")
                      //              }
                                  
                      $scope.allSites=res;
                         debugger
                      console.log($scope.allSites);

                      
                      $scope.$digest();
                    }
        })


        $scope.fetchSiteDetail= function(site){
          console.log('&--',site)


        }

        $scope.newsite = function(data){

          debugger
          if ($scope.show_site == true) {

            techieService.siteTotechie(data,function(res,error){
            if (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }else{
                      $scope.results = res;
                    console.log($scope.results);
                    $scope.$digest();

                    showAlert("successfully added the new site")
                    }
            })
          }
          if($scope.show_techie== true){
            techieService.techieTosite(data,function(res,error){
            if (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }else{
                      $scope.items = res;
                    console.log($scope.items);
                    $scope.$digest();

                    showAlert("successfully added the new site")
                    }
            })
          }
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
    
    .factory('techieService', function() {
        return {
            listSitesofTechie: function(techie, cb) {
                
                var user = Parse.Object.extend("User");
                var query = new Parse.Query(user);
                query.equalTo("username", techie.techie_name);
                query.equalTo("C_num", techie.techie_no);
                query.find({
                    success: function(results) {
                        return cb(results);

                    },
                    error: function(error) {
                        return cb(null, error);
                    }
                });
            },
            list:function(id,cb){
              var User = Parse.Object.extend("User");
              var query = new Parse.Query(User);
               query.get(id, function(subjectObj) {
                var relation = subjectObj.relation("sites");
                var query = relation.query();
                 query.find({
                   success : function(results){
                      return cb(results);
                   },
                   error : function(error) {
                      alert("Error: " + error.code + " " + error.message);
                   }
                });
            });
            },
            siteTotechie:function(details,cb){
              debugger
                Parse.Cloud.run('addSite', details,{
               success: function(status) {
                return cb(status);
                },
                error: function(error) {
            // error
                return cb(null, error);
                }
              });
            },
            listTechies: function(techie, cb) {
                debugger
                var user = Parse.Object.extend("User");
                var query = new Parse.Query(user);
                query.equalTo("name", techie.name);
                query.equalTo("Site_no", techie.Site_no);
                query.find({
                    success: function(results) {
                        return cb(results);

                    },
                    error: function(error) {
                        return cb(null, error);
                    }
                });
            },
            listSites: function(admin,cb){
              
              var site=Parse.Object.extend("Site")
              var query=new Parse.Query(site);
              query.equalTo("admin_id",admin.id);
              query.find({
                success: function(results) {
                        return cb(results);
                        console.log(results);
                    },
                    error: function(error) {
                        return cb(null, error);
                    }
              })
            },
            Sites: function(admin,cb){
              debugger
              var site=Parse.Object.extend("Site")
              var query=new Parse.Query(site);
              query.equalTo("name",admin.name);
              query.equalTo("Site_no",admin.Site_no)
              query.find({
                success: function(results) {
                        return cb(results);
                        console.log("fj",results);
                    },
                    error: function(error) {
                        return cb(null, error);
                    }
              })
            },
            techieTosite: function(details,cb){
              debugger
              Parse.Cloud.run('addtechie', details,{
               success: function(status) {
                return cb(status);
                },
                error: function(error) {
            // error
                return cb(null, error);
                }
              });
            }
        };
    })
