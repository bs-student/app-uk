(function () {

    'use strict';

    app
        .factory('adminNewsService', adminNewsService);

    adminNewsService.$inject=['apiService','SERVER_CONSTANT','ADMIN_CONSTANT'];

    function adminNewsService(apiService,SERVER_CONSTANT,ADMIN_CONSTANT) {

        return {
            getNews:_getNews,
            saveUpdatedNews:_saveUpdatedNews,
            addNews:_addNews
        };


        function _getNews(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_NEWS+"?access_token="+accessToken,data);
        }

        function _saveUpdatedNews(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.UPDATE_NEWS+"?access_token="+accessToken,data);
        }

        function _addNews(accessToken,data){
            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.ADD_NEWS+"?access_token="+accessToken,data,config);
        }

    }

})();
