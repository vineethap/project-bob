angular.module( 'ngBoilerplate.contractor', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'contractor', {
    url: '/contractor/:id ? title',
     params: { 
    	id:null,
    	title:null,
           hiddenParam: 'YES'
         },
    views: {
      "main": {
        controller: 'contractorCtrl',
        templateUrl: 'siteadmin/technician/contractor.tpl.html'        
      }
    },
    data:{ pageTitle: 'contractor' }
  })
  
  
})
.controller('contractorCtrl', function ($scope, $state,  $stateParams, $mdDialog, contractorService,techieService){
	 var id=$stateParams.id;
	$scope.title=$stateParams.title;
	console.log("id",id)
	console.log($scope.title)
    $scope.currentUser = Parse.User.current();
	$scope.districts=[
	"Northern Territory",
	"Tasmania",
    "Australian Capital Territory",	
    "South Australia",
	"Western Australia",
    " Queensland",
    "Victoria",
    "New South Wales"
	];
	// $scope.currentUser = Parse.User.current();
	// $scope.sid=$scope.currentUser.id;
	// console.log($scope.sid)
    $scope.save = function(techie) {
		debugger
		 
		contractorService.saveTechie(techie,id,function (res,error){
		    if(error) {
		    	console.log(error);
		    	showAlert("Unable to save:  " + error.code + " " + error.message);

		    }else{

             console.log(res);
             $scope.techie=res;
             showAlert("Successfully created the contractor")
		      $state.go('listTechies')
		    }
			
		});
	};
	$scope.edit=function(form){
		debugger
		contractorService.editTechie(id, form, function(res,error){
			if(error){
				showAlert("Error occured while updating");
			}
			else{
				console.log(res);
				showAlert("Updated Successfully");
			}
		})
    }
     techieService.listSites( $scope.currentUser,function(res,error){

           if (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }else{
                      $scope.allSites=res;

                      console.log( $scope.allSites);
                      $scope.$digest();
                    }
        })

    $scope.cancel=function(){
    	$state.go('listTechies')
    }
    if($scope.title=="edit"){
    	contractorService.getTechie(id,function(res,error){
		if(error) {
		    	console.log(error);
		    	showAlert("Unable to save:  " + error.code + " " + error.message);

		    }else{
		    	console.log(res)
		    	$scope.techie=res['attributes']
		    	console.log($scope.techie);
		    	$scope.$digest();
		    }
	})
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
}).factory('contractorService' ,function(){
	return{

		saveTechie:function(techie,id,cb){
			
			debugger
			var newuser = new Parse.User();
            var siteOne=new Parse.Object("Site");
            
			newuser.set("email", techie.email);
		    newuser.set("company_name", techie.company_name);
			newuser.set("username", techie.username);
			newuser.set("address_detail", techie.address_detail);
			newuser.set("state", techie.state);
			newuser.set("postalcode", techie.postalcode);
			newuser.set("work", techie.work);
			newuser.set("password", "asdf");
		    newuser.set("contact_no",techie.contact_no);
			newuser.set("home_ph", techie.home_ph);
			newuser.set("Surname", techie.Surname);
			newuser.set("C_num", techie.C_num);
			newuser.set("role", "Technician-"+id);
			 // siteOne.set("Service_address", techie.site.Service_address);
		     siteOne.set("name", techie.site);
		     siteOne.set("admin_id",id);
		     
		     siteOne.save({
		     	success: function(res) {
			        // return cb(res);
			        var relation = newuser.relation("sites");
                    relation.add(siteOne);
                    newuser.save(null, {
					    success: function(res) {
					        return cb(res);
					    },
					    error: function(error) {
					    	console.log("error :",error);
					    	
					    }
					});
			    },
			    error:function(res,error){
			    	return cb(null, error);
			    }
		     });
		} ,
		
		getTechies:function(id,cb){
			var user = Parse.Object.extend("User");
		    var query = new Parse.Query(user);
			query.equalTo("role", "Technician-"+id);
			query.find({
				success: function(results) {
					return cb(results);
					
				},
				error: function (error) {
					return cb(null, error);
				}
			});
		},
		deleteTechie: function(id,cb){
			debugger
			Parse.Cloud.run('deleteUser', { id: id }, {
           success: function(status) {
           return cb(status);
         },
         error: function(error) {
            // error
          return cb(null, error);
          }
         });
		},
		getTechie: function (id,cb) {
	    var user = Parse.Object.extend("User");
		var query = new Parse.Query(user);
			query.get(id,{
				success: function(results) {
					return cb(results);
					
				},
				error: function (error) {
					return cb(null, error);
				}
			});
		},
		editTechie:function(id,form,cb){
			form.id = id;
          	Parse.Cloud.run('editUser', form,{
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
