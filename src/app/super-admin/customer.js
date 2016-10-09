angular.module( 'ngBoilerplate.customers.customer', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'customer', {
    url: '/customer/:id ? title',
    params: { 
    	id:null,
    	title:null,
           hiddenParam: 'YES'
         },
    views: {
      "main": {
        controller: 'customerCtrl',
        templateUrl: 'super-admin/add_Siteadmin.tpl.html'
      }
    },
    data:{ pageTitle: 'customer' }
  })
  
  
})
.controller('customerCtrl', function ($scope, $state,  $stateParams, customerService, $mdDialog, userService) {
	
    var id=$stateParams.id;
	$scope.title=$stateParams.title;
	console.log("id",id);
	console.log("name",$scope.title);

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

	$scope.billDate=[
	"weekly", "fortnightly", "monthly", "annually"];

	$scope.save = function(user) {

		var file = new Parse.File('logo', user.logo, "image/png");


		user.logo=file;
		debugger
		 
		customerService.saveCustomer(user,function (res,error){
		    if(error) {
		    	console.log(error);
		    	showAlert("Unable to save:  " + error.code + " " + error.message);

		    }else{

             console.log(res);
             $scope.user=res;
             showAlert("Successfully created the Customer")
		     $scope.user=""
		     $state.go('customers')
		    }
			
		});
	};

	userService.getSingle(id, function(res,error){
     if(error){
				// showAlert("Error occured while deleting");
			}
			else{
				if(res['attributes']){
				$scope.form=res['attributes'];
				debugger
				$scope.$digest();
			}
			}
    	})
	$scope.update=function(form){
		debugger
		customerService.editCustomer(id, form, function(res,error){
			if(error){
				showAlert("Error occured while updating");
			}
			else{
				console.log(res);
				showAlert("Updated Successfully");
			}
		})
    }
    $scope.cancel=function(){
    	$state.go('customers');
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
.factory('customerService' ,function(){
	return{

		saveCustomer:function(customer,cb){
			debugger
			var newuser = new Parse.User();


			newuser.set("email", customer.email);
		    newuser.set("company_name", customer.company_name);
			newuser.set("username", customer.username);
			newuser.set("address_detail", customer.address_detail);
			newuser.set("state", customer.state);
			newuser.set("postalcode", customer.postalcode);
			newuser.set("ABN", customer.ABN);
			newuser.set("fax", customer.fax);
			newuser.set("password", "asdf");
		    newuser.set("contact_no",customer.contact_no);
			newuser.set("website", customer.website);
			newuser.set("member_amount", customer.member_amount);
			newuser.set("member_billdate", customer.member_billdate);
			newuser.set("member_balance", customer.member_balance);
			newuser.set("role", "Siteadmin");
			newuser.set("logo",customer.logo);

			// 	newuser.set("logo", parseFile);
			newuser.save(null, {
			    success: function(res) {
			    	console.log(res)
			        return cb(res);
			    },
			    error: function(error) {
			    	console.log("error :",error);
			    	return cb(null, error);
			    }
			});
		} ,
		editCustomer:function(id,form,cb){
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
		},
		deleteCustomer: function(id,cb){
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
		}
	};
}).directive("fileread",function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
});