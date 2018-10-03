(function () {

    'use strict';

    app
        .factory('adminUniversityService', adminUniversityService);

    adminUniversityService.$inject=['SERVER_CONSTANT','ADMIN_CONSTANT','apiService'];

    function adminUniversityService(SERVER_CONSTANT,ADMIN_CONSTANT,apiService) {

        return {
            getAllNonApprovedUniversities:_getAllNonApprovedUniversities,
            getAllActivatedUniversities:_getAllActivatedUniversities,
            getAllDeactivatedUniversities:_getAllDeactivatedUniversities,
            saveEditedUniversityDataOnly:_saveEditedUniversityDataOnly,
            approveMultipleUniversities:_approveMultipleUniversities,
            updateUniversityDetails:_updateUniversityDetails,
            getSimilarUniversities:_getSimilarUniversities,
            mergeUniversities:_mergeUniversities
        };

        function _getAllNonApprovedUniversities(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_NON_APPROVED_UNIVERSITIES+"?access_token="+access_token,data);
        }
        function _getAllActivatedUniversities(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_ACTIVATED_UNIVERSITIES+"?access_token="+access_token,data);
        }
        function _getAllDeactivatedUniversities(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_DEACTIVATED_UNIVERSITIES+"?access_token="+access_token,data);
        }
        function _saveEditedUniversityDataOnly(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.SAVE_EDITED_UNIVERSITY_DATA_ONLY+"?access_token="+access_token,data);
        }
        function _approveMultipleUniversities(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.APPROVE_MULTIPLE_UNIVERSITIES+"?access_token="+access_token,data);
        }
        function _updateUniversityDetails(data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.UPDATE_UNIVERSITY_DETAILS+"?access_token="+data.access_token,data);
        }
        function _getSimilarUniversities(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_SIMILAR_UNIVERSITIES+"?access_token="+access_token,data);
        }
        function _mergeUniversities(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.MERGE_UNIVERSITIES+"?access_token="+access_token,data);
        }

    }

})();
