(function () {

    'use strict';

    app
        .factory('identityService', identityService);

    identityService.$inject=['tokenService','userService'];

    function identityService(tokenService,userService) {
        var accessToken = null;
        var refreshToken = null;
        var tempAccessToken = null;
        var authorizedUserData = null;


        return {
            getInitialAccessToken : _getInitialAccessToken,
            setAccessToken: _setAccessToken,
            setAuthorizedUserData: _setAuthorizedUserData,
            getAuthorizedUserData: _getAuthorizedUserData,
            getAccessToken: _getAccessToken,
            getTempAccessToken:_getTempAccessToken,
            getRefreshAccessToken : _getRefreshAccessToken,
            getRefreshToken: _getRefreshToken,
            clearAccessToken: _clearAccessToken,
            clearAuthorizedUserData: _clearAuthorizedUserData,
            getClientCredentialAccessToken: _getClientCredentialAccessToken,
            getSocialPluginAccessToken: _getSocialPluginAccessToken
        }

        function _getInitialAccessToken(userCredentials){
            return tokenService.getInitialAccessToken(userCredentials);
        }
        function _setAccessToken(data){

            if (typeof data.access_token != "undefined") {
                accessToken= data.access_token;
                refreshToken = data.refresh_token;
                localStorage["bsAccessToken"] = accessToken;
                localStorage["bsRefreshToken"] = refreshToken;
            }
        }
        function _setAuthorizedUserData(data){
            authorizedUserData = data;
            console.log(authorizedUserData);
        }
        function _getAuthorizedUserData(){
            return authorizedUserData;
        }
        function _getAccessToken(){
            if(accessToken==null){
                accessToken=localStorage.getItem("bsAccessToken");
            }
            return accessToken;
        }
        function _getRefreshAccessToken(refreshToken){
            return tokenService.getRefreshAccessToken(refreshToken);
        }
        function _getRefreshToken(){
            if(refreshToken==null){
                refreshToken=localStorage.getItem("bsRefreshToken");

            }
            return refreshToken;
        }
        function _clearAccessToken(){
            accessToken = null;
            refreshToken = null;
            localStorage.removeItem('bsAccessToken');
            localStorage.removeItem('bsRefreshToken');
        }
        function _clearAuthorizedUserData(){
            authorizedUserData = null;
        }
        function _getClientCredentialAccessToken(){
            return tokenService.getClientCredentialAccessToken();
        }

        function _getSocialPluginAccessToken(serviceId){
            return tokenService.getSocialPluginAccessToken(serviceId);
        }
        function _getTempAccessToken(){
            if(tempAccessToken==null){
                tempAccessToken=localStorage.getItem("bsTempAccessToken");

            }
            return tempAccessToken;
        }

    }

})();
