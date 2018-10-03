(function () {

    'use strict';

    app
        .factory('adminQuoteService', adminQuoteService);

    adminQuoteService.$inject=['apiService','SERVER_CONSTANT','ADMIN_CONSTANT'];

    function adminQuoteService(apiService,SERVER_CONSTANT,ADMIN_CONSTANT) {

        return {
            getStudentQuotes:_getStudentQuotes,
            getUniversityQuotes:_getUniversityQuotes,
            saveUpdatedQuote:_saveUpdatedQuote,
            addQuote:_addQuote,
            deleteQuote:_deleteQuote
        };


        function _getStudentQuotes(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_STUDENT_QUOTES+"?access_token="+accessToken,data);
        }

        function _getUniversityQuotes(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_UNIVERSITY_QUOTES+"?access_token="+accessToken,data);
        }

        function _saveUpdatedQuote(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.UPDATE_QUOTE+"?access_token="+accessToken,data);
        }

        function _addQuote(accessToken,data){
            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.ADD_QUOTE+"?access_token="+accessToken,data,config);
        }
        function _deleteQuote(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.DELETE_QUOTE+"?access_token="+accessToken,data);
        }

    }

})();
