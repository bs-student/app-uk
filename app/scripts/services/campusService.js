(function () {

    'use strict';

    app
        .factory('campusService', campusService);

    campusService.$inject=['SERVER_CONSTANT','CAMPUS_CONSTANT','apiService'];

    function campusService(SERVER_CONSTANT,CAMPUS_CONSTANT,apiService) {

        return {
            getCampusesByUniversity:_getCampusesByUniversity,
            getCampusDetailsWithUniversityAndState: _getCampusDetailsWithUniversityAndState,
            updateCampus:_updateCampus,
            addCampus: _addCampus
        };


        function _getCampusesByUniversity(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+CAMPUS_CONSTANT.CAMPUS_LIST_BY_UNIVERSITY+"?access_token="+access_token,data);
        }
        function _getCampusDetailsWithUniversityAndState(data){
            return apiService.post(SERVER_CONSTANT.HOST+CAMPUS_CONSTANT.CAMPUS_DETAILS_WITH_UNIVERSITY_AND_STATE,data);
        }
        function _updateCampus(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+CAMPUS_CONSTANT.UPDATE_CAMPUS+"?access_token="+access_token,data);
        }
        function _addCampus(access_token,data){
            return apiService.post(SERVER_CONSTANT.HOST+CAMPUS_CONSTANT.ADD_CAMPUS+"?access_token="+access_token,data);
        }

    }

})();
