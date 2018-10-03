(function () {

    'use strict';

    app
        .factory('tokenService', tokenService);

    tokenService.$inject=['SERVER_CONSTANT','API_CLIENT_CONSTANT','ACCESS_TOKEN_CONSTANT','apiService'];

    function tokenService(SERVER_CONSTANT,API_CLIENT_CONSTANT,ACCESS_TOKEN_CONSTANT,apiService) {

        return {
            getInitialAccessToken: _getInitialAccessToken,
            getRefreshAccessToken: _getRefreshAccessToken,
            getClientCredentialAccessToken: _getClientCredentialAccessToken,
            getSocialPluginAccessToken:_getSocialPluginAccessToken
        };

        function _getInitialAccessToken(user){
            var data={
                "grant_type": ACCESS_TOKEN_CONSTANT.PASSWORD_GRANT_TYPE,
                "client_id": API_CLIENT_CONSTANT.CLIENT_ID,
                "client_secret": API_CLIENT_CONSTANT.CLIENT_SECRET,
                "username":user._username,
                "password": user._password
            }

            return apiService.post(SERVER_CONSTANT.HOST+ACCESS_TOKEN_CONSTANT.OAUTH_TOKEN_URL,data);
        }

        function _getRefreshAccessToken(refreshToken){
            var data={
                "grant_type": ACCESS_TOKEN_CONSTANT.REFRESH_TOKEN_GRANT_TYPE,
                "client_id": API_CLIENT_CONSTANT.CLIENT_ID,
                "client_secret": API_CLIENT_CONSTANT.CLIENT_SECRET,
                "refresh_token":refreshToken
            }
            return apiService.post(SERVER_CONSTANT.HOST+ACCESS_TOKEN_CONSTANT.OAUTH_TOKEN_URL,data);
        }

        function _getClientCredentialAccessToken(){
            var data={
                "grant_type": ACCESS_TOKEN_CONSTANT.CLIENT_CREDENTIALS_GRANT_TYPE,
                "client_id": API_CLIENT_CONSTANT.CLIENT_ID,
                "client_secret": API_CLIENT_CONSTANT.CLIENT_SECRET
            }
            return apiService.post(SERVER_CONSTANT.HOST+ACCESS_TOKEN_CONSTANT.OAUTH_TOKEN_URL,data);
        }
        function _getSocialPluginAccessToken(serviceId){
            var data={
                "grant_type": ACCESS_TOKEN_CONSTANT.SOCIAL_PLUGIN_GRANT_TYPE,
                "client_id": API_CLIENT_CONSTANT.CLIENT_ID,
                "client_secret": API_CLIENT_CONSTANT.CLIENT_SECRET,
                "serviceId" :serviceId
            }
            return apiService.post(SERVER_CONSTANT.HOST+ACCESS_TOKEN_CONSTANT.OAUTH_TOKEN_URL,data);
        }


    }

})();
