'use strict';

// Clients controller
angular.module('clients').controller('ClientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'clientRepository',
	function($scope, $stateParams, $location, Authentication, clientRepository) {
		$scope.authentication = Authentication;
        $scope.client = {Contact:{FirstName:"fucknutz"}};
		// Create new Client
		$scope.create = function(isValid) {
            if (isValid){
                $scope.success = $scope.error = null;
                var promise = clientRepository.Save($scope.client,'SignUpTrainerGeneratedClient');
                promise.then(function() {
                    $location.path('clients');
                }, function(errorMessage) {
                    $scope.error = errorMessage;
                });
            } else {
                $scope.submitted = true;
            }
		};

		// Remove existing Client
		$scope.remove = function( client ) {
			if ( client ) { client.$remove();

				for (var i in $scope.clients ) {
					if ($scope.clients [i] === client ) {
						$scope.clients.splice(i, 1);
					}
				}
			} else {
				$scope.client.$remove(function() {
					$location.path('clients');
				});
    			}
		};

		// Update existing Client
		$scope.update = function() {
			var client = $scope.client ;

			client.$update(function() {
				$location.path('clients/' + client._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.correctClientName = function(isValid){
            if (isValid){
                $scope.success = $scope.error = null;
                var promise = clientRepository.Save($scope.client,'correctClientsName');
                promise.then(function() {
                    $location.path('clients/' + client._id);
                }, function(errorMessage) {
                    $scope.error = errorMessage;
                });
            } else {
                $scope.submitted = true;
            }
        };
        $scope.changeEmail = function(){
            alert($scope.client.FirstName);
        };
        $scope.changePhone = function(){
            alert($scope.client.FirstName);
        };
		// Find existing Client
		$scope.findOne = function() {
            var _id = $stateParams.clientId;
            var promise = clientRepository.Get(_id);
            promise.then(function(items) {
                $scope.client = items;
            }, function(errorMessage) {
                $scope.error = errorMessage;
            });
		};
	}
]);