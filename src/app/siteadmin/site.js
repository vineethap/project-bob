angular.module( 'ngBoilerplate.site', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'site', {
    url: '/site',
    views: {
      "main": {
        controller: 'siteCtrl',
        templateUrl: 'siteadmin/site.tpl.html'
      }
    },
    data:{ pageTitle: 'site' }
  })
  
  
})
.controller('siteCtrl', function ($scope, $state,  $stateParams, siteService, $mdDialog){
$scope.gotoForm=function(){
  $state.go('addSite');
}
$scope.edit=function(id){
  $state.go('addSite',{id:id , title:"edit"});
}
$scope.delete= function(id){
siteService.deleteSite(id, function(res, error) {
      if(error){
        showAlert("Error occured while deleting");
      }
      else{
        showAlert("Your site has been succesfully deletd");
      }
    });
    
  }
 $scope.currentUser = Parse.User.current();
     $scope.c_id=$scope.currentUser.id;
siteService.get($scope.c_id,function (res,error){
    if(error){
      alert("Error: " + error.code + " " + error.message);
    }
    $scope.sites = res;
    console.log($scope.sites );
    $scope.$digest();
    });

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