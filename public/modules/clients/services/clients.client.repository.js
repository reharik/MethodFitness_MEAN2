'use strict';

//Clients service used to communicate Clients REST endpoints
angular.module('clients').factory('repository', ['$rootScope', '$http','$resource', '$q',
	function($rootScope, $http, $resource, $q ) {

        var url='clients';
        var resource=$resource(url,{id:'@_id'});
        var deferred = $q.defer();
        var items = [];

        var _getAll = function(){
            return resource.query().$promise;
        };

        var _create = function(item){
            items.push(item);
        };

        var _remove = function(item){
            _.remove(items, function (_item) {
                return _item.id === item.id;
            });
        };

        var _update = function(item){
            _remove(item);
            _create(item);
        };

        var _put = function(payload){
            $http.put(url,payload).success(function(data, status, headers, config){deferred.resolve(data)})
                .error(function(err){deferred.reject(err);});
        };

        var _post = function(payload){
            $http.post(url,payload)
                .success(function(data, status, headers, config){
                    deferred.resolve(data)})
                .error(function(err){deferred.reject(err);});
        };

        var srvs= {};
        srvs.Save= function(item, cmdName){
            var payload = {'cmdName':cmdName, 'item':item};
            if(item.id){
                _update(item);
                _put(payload);
            }else{
                _create(item);
                _post(payload);
            }
            return deferred.promise;
        };
        srvs.GetAll= function(){
            var promise = _getAll();
            promise.then(function(_items) {
                items = _items;
                deferred.resolve(items);
                deferred.reject('error message');
            });
            return deferred.promise;
        };
        srvs.Remove= function(item){
            _remove(item);
        };
        return srvs;
	}
]);