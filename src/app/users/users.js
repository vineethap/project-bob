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
  })
 
})
.controller('userController', function ($scope, $mdDialog, userService, $state){

    $scope.open = function() {
        var mdInstance = $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'users/adduser.tpl.html',
            clickOutsideToClose: true,
            reolve:{
            	items: function() {
                        return $scope.currentUser;
                    }
            }
        }).then(function(data) {
      		$scope.users.push(data);
	    }, function() {
	      	$scope.status = 'You cancelled the dialog.';
	    });
	};
    
   $scope.currentUser = Parse.User.current();
	console.log($scope.currentUser);
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
        "Superadmin",
        "Siteadmin",
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
			debugger
		    if(error) {
		    	showAlert("Unable to save:  " + error.code + " " + error.message);
		    }
			$mdDialog.hide(res);
		});
	};
	// $scope.currentUser=items;

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
			debugger
			var newuser = new Parse.User();
			newuser.set("email", user.email);
			newuser.set("username", user.username);
			newuser.set("password", user.password);
			newuser.set("role", user.role);
			newuser.signUp(null, {
			    success: function(res) {
			        return cb(res);
			    },
			    error: function(user,error) {
			    	console.log("error--->",error);
			    	return cb(null, error);
			    }
			});
		} ,
		
		getSiteadmin:function(cb){
			var user = Parse.Object.extend("User");
		    var query = new Parse.Query(user);
			query.equalTo("role", "Siteadmin");
			query.find({
				success: function(results) {
					return cb(results);
					
				},
				error: function (error) {
					return cb(null, error);
				}
			});
		},
		getSingle: function (id,cb) {
	    var user = Parse.Object.extend("User");
		var query = new Parse.Query(user);
			query.get(id,{
				success: function(results) {
					return cb(results);
					
				},
				error: function (result,error) {
					return cb(null, error);
				}
			});
		}

	};
});