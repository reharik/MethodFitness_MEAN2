'use strict';

// Clients controller
angular.module('clients').controller('ClientListController', ['$scope', '$stateParams', '$location', 'Authentication', 'repository',
	function($scope, $stateParams, $location, Authentication, repository ) {
		$scope.authentication = Authentication;
        $scope.viewModel = {

        };
		// Find a list of Clients
		$scope.find = function() {

            $scope.gridOptions = {
                enableSorting: true,
                enableScrollbars:false,
                columnDefs: [
                    { name:'firstName', field: 'FirstName' , cellTemplate: '<div ng-click="getExternalScopes().editRecord(this)"><a >{{row.entity.EmailAddress}}</a></div>' },
                    { name:'lastName', field: 'LastName' },
                    { name:'emailAddress', field: 'EmailAddress', cellTemplate: '<div><a href="mailto:{{row.entity[col.field]}}">{{row.entity[col.field]}}</a></div>'},
                    { name:'phone', field: 'Phone'}
                ],
                editRecord: function(grid){
                    var test = grid.$parent.row.entity.LastName;
                    var x='';
                }
            };
            var promise = repository.GetAll();
            promise.then(function(items) {
                $scope.gridOptions.data= items;
            }, function(errorMessage) {
                $scope.error = errorMessage;
            });
		};

        $scope.editRecord = function(a,b,c,d){
            var test = '';
        }
	}
]);