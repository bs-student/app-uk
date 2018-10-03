(function () {

    'use strict';

    app
        .factory('userService', userService);

    userService.$inject=['apiService','SERVER_CONSTANT','LOGIN_CONSTANT','USER_CONSTANT'];

    function userService(apiService,SERVER_CONSTANT,LOGIN_CONSTANT,USER_CONSTANT) {

        return {
            getAuthorizedUserShortData: _getAuthorizedUserShortData,
            getAuthorizedUserFullData: _getAuthorizedUserFullData,
            setUpdatedSocialUserData:_setUpdatedSocialUserData,
            updateUserProfile: _updateUserProfile,
            changePassword: _changePassword,
            updateUserEmailNotificationStatus : _updateUserEmailNotificationStatus
        };

        function _getAuthorizedUserShortData(accessToken){
            return apiService.get(SERVER_CONSTANT.HOST+USER_CONSTANT.CURRENT_USER_SHORT_DETAILS+"?access_token="+accessToken);
        }

        function _getAuthorizedUserFullData(accessToken){
            return apiService.get(SERVER_CONSTANT.HOST+USER_CONSTANT.CURRENT_USER_FULL_DETAILS+"?access_token="+accessToken);
        }

        function _setUpdatedSocialUserData(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+USER_CONSTANT.UPDATE_SOCIAL_USER+"?access_token="+accessToken,data);
        }

        function _updateUserProfile(accessToken,data){
            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            };
            return apiService.post(SERVER_CONSTANT.HOST+USER_CONSTANT.UPDATE_PROFILE+"?access_token="+accessToken,data,config);
        }

        function _changePassword(data){
            return apiService.post(SERVER_CONSTANT.HOST+USER_CONSTANT.CHANGE_PASSWORD,data);
        }

        function _updateUserEmailNotificationStatus(data){
            return apiService.post(SERVER_CONSTANT.HOST+USER_CONSTANT.UPDATE_USER_EMAIL_NOTIFICATION_STATUS+"?access_token="+data.accessToken,data);
        }


    }

})();
