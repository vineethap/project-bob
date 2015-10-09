angular.module( 'ngBoilerplate.users', [
  'ui.router',
  'ngMaterial'

])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'users', {
    url: '/users',
    views: {
      "main": {
        controller: 'userController',
        templateUrl: 'users/users.tpl.html'
     }
    },
    data:{ pageTitle: 'Users' }
  }); 
})
.controller('userController', function ($scope, $mdDialog, userService){

    $scope.open = function() {
        var mdInstance = $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'users/adduser.tpl.html',
            clickOutsideToClose: true
        }).then(function(data) {
      		$scope.users.push(data);
	    }, function() {
	      	$scope.status = 'You cancelled the dialog.';
	    });
	};
    
    $scope.currentUser = Parse.User.current();
    userService.get(function (res,error){
		if(error){
			alert("Error: " + error.code + " " + error.message);
		}
		$scope.users = res;
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
.controller('DialogController', function ($scope, $mdDialog, userService) {

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
   
    $scope.roles = [
        "SuperAdmin",
        "SiteAdmin",
        "Technician"
    ];

    function showAlert(content) {
		$mdDialog.show(
			$mdDialog.alert()
			.clickOutsideToClose(true)
			.content(content)
			.ariaLabel('Alert Dialog')
			.ok('OK')
		);
	}

 	$scope.save = function(user) {
		userService.saveUser(user, function (res,error){
		    if(error) {
		    	showAlert("Unable to save:  " + error.code + " " + error.message);
		    }
			$mdDialog.hide(res);
		});
	};
})

.factory('userService', function() {
	return  {
		get: function (cb) {
	    var user = Parse.Object.extend("User");
		var queryObject = new Parse.Query(user);
			queryObject.find({
				success: function(results) {
					return cb(results);
					
				},
				error: function (error) {
					return cb(null, error);
				}
			});
		},
		saveUser:function(user,cb){
			var newuser = new Parse.User();
			newuser.set("email", user.email);
			newuser.set("username", user.username);
			newuser.set("password", user.password);
			newuser.set("role", user.role);
			newuser.signUp(null, {
			    success: function(res) {
			        return cb(res);
			    },
			    error: function(error) {
			    	console.log(error);
			    	return cb(null, error);
			    }
			});
		} 
	};
});