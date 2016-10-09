angular.module( 'ngBoilerplate.customers', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'customers', {

    url: '/customers',
    views: {
      "main": {
        controller: 'customersCtrl',
        templateUrl: 'super-admin/customers.tpl.html'
      }
    },
    data:{ pageTitle: 'Customer List' }
  })
})

.controller('customersCtrl', function ($scope, $state,  $stateParams, userService, customerService) {
	userService.getSiteadmin(function (res,error){
		if(error){
			alert("Error: " + error.code + " " + error.message);
		}
		$scope.siteadmins = res;
		$scope.$digest();
    });
	$scope.gotoForm = function() {
		
		$state.go('customer' );
		console.log("gotoForm");
	};
	
	$scope.destroy =function(id){
		console.log(id);
		console.log("hi")

		customerService.deleteCustomer(id, function(client_Building, error) {
			if(error){
				showAlert("Error occured while deleting");
			}
			else{
				showAlert("Your form has been succesfully deletd");
			}
		});
	}
    $scope.edit=function(id){
    	$state.go('customer',{id:id, title:"edit"} );
    }
})