(function () {

    'use strict';

    app
        .factory('adminLogService', adminLogService);

    adminLogService.$inject=['SERVER_CONSTANT','ADMIN_CONSTANT','apiService'];

    function adminLogService(SERVER_CONSTANT,ADMIN_CONSTANT,apiService) {

        return {
            getLog:_getLog

        };

        function _getLog(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_LOG+"?access_token="+accessToken,data);
        }
    }

})();
