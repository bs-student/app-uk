(function () {

    'use strict';

    app
        .factory('adminDatabaseService', adminDatabaseService);

    adminDatabaseService.$inject=['SERVER_CONSTANT','ADMIN_CONSTANT','apiService'];

    function adminDatabaseService(SERVER_CONSTANT,ADMIN_CONSTANT,apiService) {

        return {
            adminGetAllDatabaseList:_adminGetAllDatabaseList,
            adminDownloadDatabase:_adminDownloadDatabase

        };

        function _adminGetAllDatabaseList(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_DATABASE_LIST+"?access_token="+accessToken,data);
        }
        function _adminDownloadDatabase(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.DOWNLOAD_DATABASE+"?access_token="+accessToken,data);
        }
    }

})();
