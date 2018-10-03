(function () {

    'use strict';

    app
        .factory('headerTokenService', headerTokenService);

    headerTokenService.$inject = ['SERVER_CONSTANT', 'WEB_APP_CONFIG_CONSTANT'];

    function headerTokenService(SERVER_CONSTANT, WEB_APP_CONFIG_CONSTANT) {

        return {
            generateHeaderToken: _generateHeaderToken
        };

        function _generateHeaderToken() {
            var time = new Date();
            var timeData = btoa(parseInt(time.getTime() / 6546 - 2500).toString());
            return {
                "Timestamp": parseInt(time.getTime() / 6546 - 2500).toString(),
                "Request-Source": WEB_APP_CONFIG_CONSTANT.SOURCE_TYPE,
                "Header-Token": (CryptoJS.HmacSHA256(timeData, WEB_APP_CONFIG_CONSTANT.API_KEY).toString())
            }
        }

    }

})();