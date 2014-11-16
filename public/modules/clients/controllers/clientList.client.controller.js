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
                    { name:'firstName', field: 'FirstName', cellTemplate:'<div><a data-ng-href="/#!/clients/{{row.entity._id}}/edit">{{row.entity.FirstName}}</a> </div>' },
                    { name:'lastName', field: 'LastName' },
                    { name:'emailAddress', field: 'EmailAddress', cellTemplate:'<div><a href="mailto:{{row.entity.EmailAddress}}">{{row.entity.EmailAddress}}</a></div>'},
                    { name:'phone', field: 'Phone'}
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