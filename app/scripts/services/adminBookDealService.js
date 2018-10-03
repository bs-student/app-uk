(function () {

    'use strict';

    app
        .factory('adminBookDealService', adminBookDealService);

    adminBookDealService.$inject=['SERVER_CONSTANT','ADMIN_CONSTANT','apiService'];

    function adminBookDealService(SERVER_CONSTANT,ADMIN_CONSTANT,apiService) {

        return {
            getAllBookDeals:_getAllBookDeals,
            getAllSoldBookDeals:_getAllSoldBookDeals

        };

        function _getAllBookDeals(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_BOOK_DEALS+"?access_token="+accessToken,data);
        }

        function _getAllSoldBookDeals(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_SOLD_BOOK_DEALS+"?access_token="+accessToken,data);
        }
    }

})();
