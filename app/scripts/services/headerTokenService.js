(function () {

    'use strict';

    app
        .factory('tokenHeaderService', tokenHeaderService);

    tokenHeaderService.$inject = ['SERVER_CONSTANT', 'API_CLIENT_CONSTANT', 'ACCESS_TOKEN_CONSTANT', 'apiService'];

    function tokenHeaderService(SERVER_CONSTANT, API_CLIENT_CONSTANT, ACCESS_TOKEN_CONSTANT, apiService) {

        return {
            generateHeaderToken: _generateHeaderToken
        };

        function _generateHeaderToken() {
            var time = new Date();
            var oldTime = time;
            time.setSeconds((((time.getSeconds() + 30)*6546)-2500));
            console.log(oldTime.getTime());
            console.log(time.getTime());
            // var timeBase64 = btoa(time.getTime().toString());
            // return {
            //     timestamp:
            // }
            // return (CryptoJS.HmacSHA256(timeBase64,API_CLIENT_CONSTANT.CLIENT_SECRET).toString());
        }

    }

})();
