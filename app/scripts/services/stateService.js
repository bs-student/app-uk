(function () {

    'use strict';

    app
        .factory('stateService', stateService);

    stateService.$inject=['SERVER_CONSTANT','STATE_CONSTANT','apiService'];

    function stateService(SERVER_CONSTANT,STATE_CONSTANT,apiService) {

        return {
            getStateListByCountry: _getStateListByCountry
        };

        function _getStateListByCountry(data){
            return apiService.post(SERVER_CONSTANT.HOST+STATE_CONSTANT.STATE_LIST_BY_COUNTRY,data);
        }


    }

})();
