angular.module( 'ngBoilerplate.forms', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'forms', {
    url: '/forms',
    views: {
      "main": {
        controller: 'formsCtrl',
        templateUrl: 'forms/forms.tpl.html'
      }
    },
    data:{ pageTitle: 'Forms' }
  }); 
})

.controller('formsCtrl', function ($scope, $state,  $stateParams) {
	var ClientBuilding = Parse.Object.extend("client_building");
	var queryObject = new Parse.Query(ClientBuilding);

	queryObject.find({
		success: function(results) {
			$scope.forms = results;
			$scope.$digest();
		},
		error: function (error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

	$scope.gotoForm = function(id) {
		$state.go('single', {id:id});
	};
});