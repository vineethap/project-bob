angular.module( 'ngBoilerplate.listTechies', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'listTechies', {
    url: '/listTechies',
   
    views: {
      "main": {
        controller: 'listTechiesCtrl',
        templateUrl: 'siteadmin/technician/listTechies.tpl.html'
      }
    },
    data:{ pageTitle: 'Technicians' }
  })
  
  
})
.controller('listTechiesCtrl', function ($scope, $state,  $stateParams, contractorService, $mdDialog){
 
  $scope.currentUser = Parse.User.current();
  $scope.sid=$scope.currentUser.id;

  $scope.gotoForm=function(id){
  console.log("logging")
  $state.go('contractor',{id:id,title:"add"});
}
  contractorService.getTechies($scope.sid,function(res,error){
		if(error){
			console.log(error)
			showAlert("no data")
		}
		$scope.techies=res;
		console.log($scope.techies);
		$scope.$digest();

	})
  $scope.delete= function(id){
    console.log(id);
    		contractorService.deleteTechie(id, function(client_Building, error) {
			if(error){
				showAlert("Error occured while deleting");
			}
			else{
				showAlert("Technician has been succesfully removed");
			}
		});
  }
  $scope.edit=function(id){
  $state.go('contractor',{id:id , title:"edit"});
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
});