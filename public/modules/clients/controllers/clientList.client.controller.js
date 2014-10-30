'use strict';

// Clients controller
angular.module('clients').controller('ClientListController', ['$scope', '$stateParams', '$location', 'Authentication', 'repository',
	function($scope, $stateParams, $location, Authentication, repository ) {
		$scope.authentication = Authentication;

		// Find a list of Clients
		$scope.find = function() {
            $scope.gridOptions = {
                enableSorting: true,
                columnDefs: [
                    { name:'firstName', field: 'FirstName' },
                    { name:'lastName', field: 'LastName' },
                    { name:'city', field: 'City'},
                    { name:'zip', field: 'Zip'}
                ]};
            var promise = repository.GetAll();
            promise.then(function(items) {
                $scope.gridOptions.data= items;
            }, function(errorMessage) {
                $scope.error = errorMessage;
            });
		};
	}
]);