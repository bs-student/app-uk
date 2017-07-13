(function () {

    'use strict';

    app
        .factory('adminReportService', adminReportService);

    adminReportService.$inject=['SERVER_CONSTANT','ADMIN_CONSTANT','apiService'];

    function adminReportService(SERVER_CONSTANT,ADMIN_CONSTANT,apiService) {

        return {
            getNormalAndSocialUserData:_getNormalAndSocialUserData,
            getLoginAndRegistrationUserData:_getLoginAndRegistrationUserData,
            getBookDealAndContactData:_getBookDealAndContactData,
            getBookDealMethodData:_getBookDealMethodData,
            getUniversitiesUserData:_getUniversitiesUserData,
            getGoogleAccessToken:_getGoogleAccessToken
        };

        function _getNormalAndSocialUserData(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_NORMAL_AND_SOCIAL_USER_DATA+"?access_token="+accessToken,data);
        }

        function _getLoginAndRegistrationUserData(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_LOGIN_AND_REGISTRATION_USER_DATA+"?access_token="+accessToken,data);
        }
        function _getBookDealAndContactData(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_BOOK_DEAL_AND_CONTACT_DATA+"?access_token="+accessToken,data);
        }
        function _getBookDealMethodData(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_BOOK_DEAL_METHOD_DATA+"?access_token="+accessToken,data);
        }

        function _getUniversitiesUserData(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_UNIVERSITIES_USER_DATA+"?access_token="+accessToken,data);
        }

        function _getGoogleAccessToken(accessToken){
            return apiService.get(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_GOOGLE_ACCESS_TOKEN+"?access_token="+accessToken);
        }


    }

})();
