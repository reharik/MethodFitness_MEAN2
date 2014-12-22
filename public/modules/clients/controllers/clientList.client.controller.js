'use strict';

// Clients controller
angular.module('clients').controller('ClientListController', ['$scope', '$stateParams', '$location', 'Authentication', 'clientRepository',
	function($scope, $stateParams, $location, Authentication, clientRepository ) {
		$scope.authentication = Authentication;

		// Find a list of Clients
		$scope.find = function() {

            $scope.gridOptions = {
                data:[],
                enableSorting: true,
                enableScrollbars:false,
                columnDefs: [
                    { name:'firstName', field: 'FirstName', cellTemplate:'<div><a data-ng-href="/#!/clients/{{row.entity._id}}">{{row.entity.FirstName}}</a> </div>' },
                    { name:'lastName', field: 'LastName' },
                    { name:'emailAddress', field: 'EmailAddress', cellTemplate:'<div><a href="mailto:{{row.entity.EmailAddress}}">{{row.entity.EmailAddress}}</a></div>'},
                    { name:'phone', field: 'Phone'}],
            };

            var promise = clientRepository.GetAll();
            promise.then(function(items) {
                $scope.gridOptions.data= items;
            }, function(errorMessage) {
                $scope.error = errorMessage;
            });
        };
	}
]);
