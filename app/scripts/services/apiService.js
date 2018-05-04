(function () {

    'use strict';

    app
        .factory('apiService', apiService);

    apiService.$inject = ['$http','$q','headerTokenService'];

    function apiService($http,$q,headerTokenService) {

        return {
            get: _get,
            post: _post,
            put: _put,
            patch: _patch,
            remove: _remove
        };


        function _get(url, config) {
            var defer = $q.defer();

            if(config!=undefined){
                config["timeout"]=defer.promise;
            }else{
                config={timeout:defer.promise}
            }

            config.headers = headerTokenService.generateHeaderToken();

            var promise = $http.get(url, config);

            promise.abort = function(reason){
                defer.resolve(reason);
            };

            return  promise;
        }

        function _post(url, data, config) {
            var defer = $q.defer();

            if(config!=undefined){
                config["timeout"]=defer.promise;
            }else{
                config={timeout:defer.promise}
            }

            config.headers = headerTokenService.generateHeaderToken();

            var promise= $http.post(url, data, config);

            promise.abort = function(reason){
                defer.resolve(reason);
            };

            return promise;
        }


        function _put(url, data, config) {
            var defer = $q.defer();
            if(config!=undefined){
                config["timeout"]=defer.promise;
            }else{
                config={timeout:defer.promise}
            }
            var promise= $http.put(url, data, config);
            promise.abort = function(reason){
                defer.resolve(reason);
            };

            return  promise;
        }

        function _patch(url, data, config) {
            var defer = $q.defer();
            if(config!=undefined){
                config["timeout"]=defer.promise;
            }else{
                config={timeout:defer.promise}
            }
            var promise= $http.patch(url, data, config);
            promise.abort = function(reason){
                defer.resolve(reason);
            };

            return  promise;
        }

        function _remove(url, config) {
            var defer = $q.defer();
            if(config!=undefined){
                config["timeout"]=defer.promise;
            }else{
                config={timeout:defer.promise}
            }
            var promise= $http.delete(url, config);
            promise.abort = function(reason){
                defer.resolve(reason);
            };

            return  promise;
        }

    }

})();