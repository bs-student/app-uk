(function () {

    'use strict';

    app
        .factory('countryService', countryService);

    countryService.$inject=['SERVER_CONSTANT','COUNTRY_CONSTANT','apiService'];

    function countryService(SERVER_CONSTANT,COUNTRY_CONSTANT,apiService) {

        return {
            getCountryList: _getCountryList
        };

        function _getCountryList(){
            return apiService.post(SERVER_CONSTANT.HOST+COUNTRY_CONSTANT.COUNTRY_LIST);
        }


    }

})();
