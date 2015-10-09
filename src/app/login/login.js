angular.module('ngBoilerplate.login', [
    'ui.router',
    'ngMaterial'
])

.config(function config($stateProvider) {
})
.controller('loginCtrl', function ($scope, $state, loginService, $mdDialog) {

  function showAlert(content) {
      $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(true)
        .content(content)
        .ariaLabel('Alert Dialog')
        .ok('OK')
      );
    }

    $scope.userLogin = function(form) {
        loginService.Login(form, function(res, error) {
            if (error) {
                showAlert("Invalid username or password");
            }
            $state.go('home');
            $scope.currentUser = res;
        });
    };
})
.factory('loginService', function() {
    return {
        Login: function(form, cb) {

            Parse.User.logIn(form.username, form.password, {
                success: function(results) {
                    return cb(results);
                },
                error: function(error) {
                    return cb(null, error);
                }
            });
        }
    };
});
