angular.module('ngBoilerplate.items', [
    'ui.router',
    'ngMaterial'
])
.config(function config($stateProvider) {
        $stateProvider.state('items', {
            url: '/items',
            views: {
                "main": {
                    controller: 'itemsCtrl',
                    templateUrl: 'siteadmin/site-techie/items.tpl.html'
                }
            },
            data: {
                pageTitle: 'items'
            }
        })

    })
.controller('itemsCtrl', function ($scope, $state, $stateParams, $mdDialog) {
 
    $scope.open = function() {
        var mdInstance = $mdDialog.show({
            controller: 'newItemController',
            templateUrl: 'siteadmin/site-techie/newItem.tpl.html',
            clickOutsideToClose: true
        })
	};
    // .then(function(data) {
    //   		$scope.users.push(data);
	   //  }, function() {
	   //    	$scope.status = 'You cancelled the dialog.';
	   //  });
   
  


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
.controller('newItemController', function ($scope, $mdDialog, itemService) {

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    function showAlert(content) {
		$mdDialog.show(
			$mdDialog.alert()
			.clickOutsideToClose(true)
			.content(content)
			.ariaLabel('Alert Dialog')
			.ok('OK')
		);
	}

 	$scope.save = function(item) {
		itemService.saveItem(item, function (res,error){
		    if(error) {
		    	showAlert("Unable to save:  " + error.code + " " + error.message);
		    }
		    showAlert("success");
		    console.log(res)
			$mdDialog.hide(res);
		});
	};
	
})
.factory('itemService', function() {
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
		saveItem:function(item,cb){
			var Item = Parse.Object.extend("Item");
            var newitem = new Item();
			newitem.set("Item_code", item.Item_code);
			newitem.set("long_description", item.long_description);
			newitem.set("short_description", item.short_description);
			newitem.set("Price", item.Price);
			newitem.save(null, {
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
})

