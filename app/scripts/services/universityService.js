(function () {

    'use strict';

    app
        .factory('universityService', universityService);

    universityService.$inject=['SERVER_CONSTANT','UNIVERSITY_CONSTANT','apiService'];

    function universityService(SERVER_CONSTANT,UNIVERSITY_CONSTANT,apiService) {

        return {
            getUniversitiesForAutocomplete : _getUniversitiesForAutocomplete,
            saveNewUniversities: _saveNewUniversities
        };


        function _getUniversitiesForAutocomplete(query){
            return apiService.post(SERVER_CONSTANT.HOST+UNIVERSITY_CONSTANT.AUTOCOMPLETE_SEARCH_LIST,query);
        }
        function _saveNewUniversities(data){
            if(data.access_token==null){
                return apiService.post(SERVER_CONSTANT.HOST+UNIVERSITY_CONSTANT.SAVE_NEW_UNIVERSITY,data);
            }else{
                return apiService.post(SERVER_CONSTANT.HOST+UNIVERSITY_CONSTANT.SAVE_NEW_UNIVERSITY_LOGGED_IN_USER+"?access_token="+data.access_token,data);
            }

        }

    }

})();
