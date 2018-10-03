(function () {

    'use strict';

    app
        .factory('bookDealService', bookDealService);

    bookDealService.$inject=['SERVER_CONSTANT','BOOK_DEAL_CONSTANT','apiService'];

    function bookDealService(SERVER_CONSTANT,BOOK_DEAL_CONSTANT,apiService) {

        return {
            getBookDealsIhaveContactedFor:_getBookDealsIhaveContactedFor,
            getBookDealsOfMine:_getBookDealsOfMine,
            sellBookToUser: _sellBookToUser,
            getBookDealsOfMineWhichAreSold:_getBookDealsOfMineWhichAreSold,
            getBookDealsOfMineWhichAreBought: _getBookDealsOfMineWhichAreBought,
            changeBookDealStatus:_changeBookDealStatus,
            getLowestCampusDealPrice:_getLowestCampusDealPrice,
            updateBookDeal:_updateBookDeal,
            deleteBookDeal:_deleteBookDeal,
            getActivatedBookDealsOfUser:_getActivatedBookDealsOfUser,

            //for Message
            getAllActivatedDealsForMessageBoard:_getAllActivatedDealsForMessageBoard,
            addBookDealAsStarred:_addBookDealAsStarred,

            //for Contacts
            getAllDataForNewContactInMessageBoard:_getAllDataForNewContactInMessageBoard

        };


        function _getBookDealsIhaveContactedFor(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_BOOK_DEALS_I_HAVE_CONTACTED_FOR+"?access_token="+accessToken,data);
        }

        function _getBookDealsOfMine(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_BOOK_DEALS_I_HAVE_CREATED+"?access_token="+accessToken,data);
        }

        function _sellBookToUser(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.SELL_BOOK_TO_USER+"?access_token="+accessToken,data);
        }

        function _getBookDealsOfMineWhichAreSold(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_BOOK_DEALS_I_HAVE_CREATED_AND_SOLD+"?access_token="+accessToken,data);
        }

        function _getBookDealsOfMineWhichAreBought(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_BOOK_DEALS_I_HAVE_BOUGHT+"?access_token="+accessToken,data);
        }

        function _changeBookDealStatus(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.CHANGE_BOOK_DEAL_STATUS+"?access_token="+accessToken,data);
        }

        function _getLowestCampusDealPrice(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_LOWEST_CAMPUS_DEAL_PRICE+"?access_token="+accessToken,data);
        }

        function _updateBookDeal(accessToken,data){
            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            };
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.UPDATE_BOOK_DEAL+"?access_token="+accessToken,data,config);
        }

        function _deleteBookDeal(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.DELETE_BOOK_DEAL+"?access_token="+accessToken,data);
        }

        function _getActivatedBookDealsOfUser(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_ACTIVATED_BOOK_DEAL_OF_USER,data);
        }

        function _getAllActivatedDealsForMessageBoard(accessToken){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_All_ACTIVATED_DEALS_FOR_MESSAGE_BOARD+"?access_token="+accessToken);
        }

        function _addBookDealAsStarred(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.ADD_BOOK_DEAL_TO_STAR_LIST+"?access_token="+data.accessToken,data);
        }

        function _getAllDataForNewContactInMessageBoard(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_DEAL_CONSTANT.GET_ALL_DATA_FOR_NEW_CONTACT_IN_MESSAGE_BOARD+"?access_token="+data.accessToken,data);
        }



    }

})();
