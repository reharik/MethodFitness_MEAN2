'use strict';

//Clients service used to communicate Clients REST endpoints
angular.module('clients').factory('clientRepository', ['$rootScope', '$http','$resource', '$q',
	function($rootScope, $http, $resource, $q ) {

        var url = 'clients';
        var resource=$resource('/clients/:clientId',{clientId:'@id'});

//        var resource=$resource(url,{id:'@_id'});
        var deferred = $q.defer();
        var items = [];

        var _getAll = function(){
            var $promise = resource.query().$promise;
            return  $promise;
        };

        var _create = function(item){
            items.push(item);
        };
        var _get = function(id){
            return resource.get({clientId: id}).$promise;
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
            var route = url +'/'+payload.item._id+ '/'+payload.cmdName;
            $http.put(route,payload).success(function(data, status, headers, config){deferred.resolve(data)})
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
            if(item._id){
                _update(item,cmdName);
                _put(payload);
            }else{
                _create(item);
                _post(payload);
            }
            return deferred.promise;
        };

        srvs.GetAll= function(){
//            return _getAll();
            var promise = _getAll();
            promise.then(function(_items) {
                    // do a map take all new items keep ones that are in items but not in _items
                    items = _items;
                    deferred.resolve(items);
                },
                function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        };
        srvs.Remove= function(item){
            _remove(item);
        };
        srvs.Get= function(id){
            return _get(id);
        }
        return srvs;
	}
]);