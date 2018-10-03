(function () {

    'use strict';

    app
        .factory('referralService', referralService);

    referralService.$inject=['SERVER_CONSTANT','REFERRAL_CONSTANT','apiService'];

    function referralService(SERVER_CONSTANT,REFERRAL_CONSTANT,apiService) {

        return {
            getReferralList: _getReferralList
        };

        function _getReferralList(){
            return apiService.post(SERVER_CONSTANT.HOST+REFERRAL_CONSTANT.REFERRAL_LIST);
        }


    }

})();
