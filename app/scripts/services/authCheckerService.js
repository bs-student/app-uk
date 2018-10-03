(function () {

    'use strict';

    app
        .factory('authCheckerService', authCheckerService);

    authCheckerService.$inject=['identityService','userService','$q','$state'];

    function authCheckerService(identityService,userService,$q,$state) {


        return {
            checkIfLoggedIn:_checkIfLoggedIn,
            checkIfAdminLoggedIn:_checkIfAdminLoggedIn,
            checkIfLoggedInNormal:_checkIfLoggedInNormal
        };


        function _checkIfLoggedIn(defer){

            if(!defer){
                var defer = $q.defer();
            }

            if (identityService.getAuthorizedUserData() == null) {
                userService.getAuthorizedUserShortData(identityService.getAccessToken()).then(function(response){
                    identityService.setAuthorizedUserData(response.data.success.successData);
                    defer.resolve();

                }).catch(function(response){
                    if (response.data.error_description == "The access token provided has expired.") {
                        identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function(response){

                            identityService.setAccessToken(response.data);

                            _checkIfLoggedIn(defer);

                        }).catch(function(response){
                            $state.go("app.login");

                        });
                    }else{
                        $state.go("app.login");
                    }
                });
            } else {
                if (identityService.getAuthorizedUserData().registrationStatus == "incomplete") {
                    defer.resolve();

                } else if (identityService.getAuthorizedUserData().registrationStatus == "complete") {
                    defer.resolve();
                }

            }


            return defer.promise;
        }

        function _checkIfAdminLoggedIn(defer){

            if(!defer){
                var defer = $q.defer();
            }

            if (identityService.getAuthorizedUserData() == null) {
                userService.getAuthorizedUserShortData(identityService.getAccessToken()).then(function(response){
                    identityService.setAuthorizedUserData(response.data.success.successData);
                    if (response.data.success.successData.role.indexOf("ROLE_ADMIN_USER") >= 0) {
                        defer.resolve();
                    }else{
                        $state.go("app.accessDenied");
                    }


                }).catch(function(response){
                    if (response.data.error_description == "The access token provided has expired.") {
                        identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function(response){

                            identityService.setAccessToken(response.data);

                            _checkIfAdminLoggedIn(defer);

                        }).catch(function(response){
                            $state.go("app.accessDenied");
                        });
                    }else{
                        $state.go("app.accessDenied");
                    }
                });
            } else {
                if (identityService.getAuthorizedUserData().role.indexOf("ROLE_ADMIN_USER") >= 0) {
                    defer.resolve();
                }else{
                    $state.go("app.accessDenied");
                }

            }


            return defer.promise;
        }

        function _checkIfLoggedInNormal(){
            if(!defer){
                var defer = $q.defer();
            }

            if (identityService.getAuthorizedUserData() == null) {
                userService.getAuthorizedUserShortData(identityService.getAccessToken()).then(function(response){
                    identityService.setAuthorizedUserData(response.data.success.successData);
                    defer.resolve();

                }).catch(function(response){
                    if (response.data.error_description == "The access token provided has expired.") {
                        identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function(response){

                            identityService.setAccessToken(response.data);

                            _checkIfLoggedIn(defer);

                        }).catch(function(response){
                            defer.resolve();

                        });
                    }else{
                        defer.resolve();
                    }
                });
            } else {
                if (identityService.getAuthorizedUserData().registrationStatus == "incomplete") {
                    defer.resolve();

                } else if (identityService.getAuthorizedUserData().registrationStatus == "complete") {
                    defer.resolve();
                }

            }


            return defer.promise;
        }


    }

})();
