	angular.module( 'ngBoilerplate.users.user', [
  'ui.router',
  'ngMaterial'
])
  .config(function config( $stateProvider ) {
  $stateProvider.state( 'user', {
    url: '/user',
    views: {
      "main": {
        controller: 'userController',
        templateUrl: 'users/adduser.tpl.html'
      }
    },
    data:{ pageTitle: 'User' }
  });
})
 .controller('user', function($scope, $mdDialog) {
 });
