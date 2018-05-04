(function () {

    'use strict';

    app
        .factory('wishListService', wishListService);

    wishListService.$inject=['SERVER_CONSTANT','WISHLIST_CONSTANT','apiService'];

    function wishListService(SERVER_CONSTANT,WISHLIST_CONSTANT,apiService) {

        return {

            addBookToWishList:_addBookToWishList,
            getMyWishList: _getMyWishList,
            removeWishListItem:_removeWishListItem,
            checkIfAddedIntoWishList:_checkIfAddedIntoWishList
        }



        function _addBookToWishList(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+WISHLIST_CONSTANT.ADD_BOOK_TO_WISH_LIST+"?access_token="+accessToken,data);
        }
        function _getMyWishList(accessToken){
            return apiService.get(SERVER_CONSTANT.HOST+WISHLIST_CONSTANT.GET_MY_WISHLIST+"?access_token="+accessToken);
        }
        function _removeWishListItem(data){
            return apiService.post(SERVER_CONSTANT.HOST+WISHLIST_CONSTANT.REMOVE_WISHLIST_ITEM+"?access_token="+data.accessToken,data);
        }
        function _checkIfAddedIntoWishList(data){
            return apiService.post(SERVER_CONSTANT.HOST+WISHLIST_CONSTANT.CHECK_IF_ADDED_INTO_WISHLIST+"?access_token="+data.accessToken,data);
        }


    }

})();
