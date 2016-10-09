angular.module('ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ngBoilerplate.home',
    'ngBoilerplate.about',
    'ngBoilerplate.forms',
    'ngBoilerplate.forms.single',
    'ngBoilerplate.login',
    'ngBoilerplate.users',
    'ngBoilerplate.customers',
    'ngBoilerplate.customers.customer',
    'ngBoilerplate.site',
    'ngBoilerplate.site.addSite',
    'ngBoilerplate.site_techie',
    'ngBoilerplate.contractor',
    'ngBoilerplate.listTechies',
    'ngBoilerplate.items',
    'ui.router'
])

.config(function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home');
    $stateProvider.state('login', {
        url: '/login',
        views: {
            "main": {
                controller: 'loginCtrl',
                templateUrl: 'login/login.tpl.html'
            }
        },
        data: {
            pageTitle: 'Login'
        }
    });
})

.run(function run($state) {

})

.controller('AppCtrl', function AppCtrl($scope, $location, $mdSidenav, $state) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, next) {
        var currentUser = Parse.User.current();
        $scope.c_user = currentUser;
        if (currentUser) {
            if (toState.url == '/login') {
                $state.go('home');
            }

            if (angular.isDefined(toState.data.pageTitle)) {

                $scope.pageTitle = toState.data.pageTitle + ' | Angualr Material';
            }
            $scope.menus = [{
                name: "Home",
                url: "home"
            }, {
                name: "About",
                url: "about"
            }, {
                name: "Forms",
                url: "forms"
            }
            ];

            if (currentUser.get('role') == "Superadmin" ) {
                $scope.menus.push(
                {
                    
                    name: "Users",
                    url: "users"
                },
                   {
                    name: "Customer List",
                    url: "customers"
                   }
                );
            }
            if( currentUser.get('role') == "Siteadmin"){
                $scope.menus.push({
                    name:"site",
                    url:"site"
                },{
                    name:"Site Techies",
                    url:"site_techie"
                },{
                   name:"Technicians",
                   url:"listTechies" 
                },{
                name: "items",
                url: "items"
            });
            }
           
        } else {
            $state.go('login');
        }


    });


    $scope.Logout = function(form) {
        Parse.User.logOut();
        $scope.currentUser = null;
        $state.go('login');
        console.log("logged out");
    };

    $scope.toggleSidenav = function() {
        $mdSidenav('left').toggle();
    };

})

;
