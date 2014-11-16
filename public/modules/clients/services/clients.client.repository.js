'use strict';

//Clients service used to communicate Clients REST endpoints
angular.module('clients').factory('repository', ['$rootScope', '$http','$resource', '$q', //'lodash',
	function($rootScope, $http, $resource, $q ) {

        var deferred = $q.defer();
        var items = [];

        var _getAll = function(){
            var resource=$resource('clients',{id:'@_id'});
            return resource.query().$promise;
        };

        var _create = function(item){
            items.push(item);
        };

        var _get = function(id){
//            var client = _.first(items, function (i, item) {
//                item.id == id
//            });
//            if(!client){
            var resource=$resource('/clients/:id',{id:'@id'});
                return resource.get({id:id}).$promise;
//            }
        }

        var _query = function(queryParam){
            var _queryParam = queryParam;
            var client = _.first(items, function (i, item) {
                item.id == id
            });
//            if(!client){
//                return resource.query(id==).$promise;
//            }
        }

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

        srvs.Get= function(id){
            var promise = _get(id);
            promise.then(function(_item) {
                deferred.resolve(_item);
                deferred.reject('error message');
            });
            return deferred.promise;
        };

        srvs.Query= function(query){
            var promise = _query(query);
            promise.then(function(_item) {
                deferred.resolve(_item);
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