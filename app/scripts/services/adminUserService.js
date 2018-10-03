(function () {

    'use strict';

    app
        .factory('adminUserService', adminUserService);

    adminUserService.$inject=['apiService','SERVER_CONSTANT','ADMIN_CONSTANT'];

    function adminUserService(apiService,SERVER_CONSTANT,ADMIN_CONSTANT) {

        return {
            getAllNonApprovedUsers:_getAllNonApprovedUsers,
            getAllApprovedUsers:_getAllApprovedUsers,
            getAllAdminUsers: _getAllAdminUsers,
            saveUpdatedUserDataAdmin: _saveUpdatedUserDataAdmin,
            approveUsers:_approveUsers,
            addAdminUser:_addAdminUser
        };


        function _getAllNonApprovedUsers(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_NON_APPROVED_USER+"?access_token="+accessToken,data);
        }

        function _getAllApprovedUsers(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_APPROVED_USER+"?access_token="+accessToken,data);
        }

        function _getAllAdminUsers(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_ADMIN_USER+"?access_token="+accessToken,data);
        }

        function _saveUpdatedUserDataAdmin(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.ADMIN_UPDATE_USER_DATA+"?access_token="+accessToken,data);
        }

        function _approveUsers(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.APPROVE_USERS+"?access_token="+accessToken,data);
        }

        function _addAdminUser(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.ADD_ADMIN_USER+"?access_token="+accessToken,data);
        }


    }

})();
