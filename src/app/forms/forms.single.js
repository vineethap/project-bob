angular.module( 'ngBoilerplate.forms.single', [
  'ui.router',
  'ngMaterial'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'single', {
    url: '/forms/:id',
    views: {
      "main": {
        controller: 'formSingleCtrl',
        templateUrl: 'forms/forms.single.tpl.html'
      }
    },
    data:{ pageTitle: 'Form' }
  });
})

.controller('formSingleCtrl', function ($scope, $stateParams, $mdDialog, formService) {
	$scope.form = {};
	var id = $stateParams.id;

	formService.get(id, function(client_Building, error) {
		if(error){
			showAlert("Sorry, form not found");
		}else{
			$scope.customer_name = client_Building.get('customer_name');
			$scope.site_name = client_Building.get('site_name');
			$scope.site_address = client_Building.get('site_address');
			$scope.suburb = client_Building.get('suburb');
			$scope.site_no = client_Building.get('site_no');
			$scope.form.contact_person = client_Building.get('contact_person');
			$scope.form.contact_phone = client_Building.get('contact_phone');
			$scope.form.email = client_Building.get('email');
			$scope.form.arrival_time = client_Building.get('arrival_time');
			$scope.form.technician = client_Building.get('technician');
			$scope.form.account_no = client_Building.get('account_no');
			$scope.form.level_test = client_Building.get('level_test');
			$scope.form.rows = client_Building.get('fitting_results');

			if(!client_Building.get('fitting_results')|| (client_Building.get('fitting_results').length === 0 )){
				$scope.form.rows = [{number:1, button:true}];
			}

			$scope.form.cb = client_Building.get('test_checklist');
			$scope.form.actions_taken = client_Building.get('actions_taken');
			$scope.form.failed = client_Building.get('fittings_failed');
			$scope.form.contrator_name = client_Building.get('contractor_name');
			$scope.form.contrator_code = client_Building.get('contractor_code');
			$scope.form.comments = client_Building.get('comments');
			$scope.$digest();
		}

	});
	$scope.currentUser = Parse.User.current();
	$scope.roles=$scope.currentUser.get('role');
	$scope.save = function (form) {

		formService.update(id, form, function(client_Building, error) {
			if(error){
				showAlert("Error occured while updating");
			}
			else{
				showAlert("Your form has been succesfully updated");
			}
		});
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
})

.directive('fittingNumbersResults', function fittingNumbersResults() {
	return {
		restrict: 'EA',
		templateUrl: 'forms/fittingNumbersResults.tpl.html',
		scope : {
			rows : "="
		},
		link: function(scope, element, attr) {
			scope.addrow = function(row){
				//set current button false
				row.button  = false;
				scope.rows.push({number :row.number+1, button:true});
			};
		} 
	};
})

.factory('formService', function() {
	return  {
		get: function (id, cb) {
			var ClientBuilding = Parse.Object.extend("client_building");
			var query = new Parse.Query(ClientBuilding);

			query.get(id, {
				success: function(client_Building) {
					return cb(client_Building);
				},
				error: function(object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					return cb(null, error);
				}
			});
		},

		update : function (id, form, cb) {

			var ClientBuilding = Parse.Object.extend("client_building");
			var query = new Parse.Query(ClientBuilding);

			query.get(id,{
				success: function(client_Building) {

					console.log("Save function working...", form.service_date);
					client_Building.set("contact_person", form.contact_person);
					client_Building.set("contact_phone", form.contact_phone);
					client_Building.set("email", form.email);
					client_Building.set("arrival_time", form.arrival_time);
					client_Building.set("technician", form.technician);
					client_Building.set("account_no", form.account_no);
					client_Building.set("level_test", form.level_test);
					client_Building.set("service_date", form.service_date);
					client_Building.set("fitting_results", angular.copy(form.rows));
					client_Building.set("actions_taken", form.actions_taken);
					client_Building.set("test_checklist", form.cb);
					client_Building.set("fittings_failed", form.failed);
					client_Building.set("comments", form.comments);
					client_Building.set("contractor_name", form.contrator_name);
					client_Building.set("contractor_code", form.contrator_code);

					client_Building.save(null, {
						success: function (clientBuilding) {
							console.log("Save function Completed");
							return cb(client_Building);
						},
						error: function (clientBuilding, error){
							return cb(null, error);
						}
					});
				},
				error :  function(object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					return cb(null, error);
				}
			});
		}
	};
});