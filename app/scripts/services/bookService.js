(function () {

    'use strict';

    app
        .factory('bookService', bookService);

    bookService.$inject=['SERVER_CONSTANT','BOOK_CONSTANT','apiService'];

    function bookService(SERVER_CONSTANT,BOOK_CONSTANT,apiService) {

        return {
            searchBooks:_searchBooks,
            getLowestOnlinePrice:_getLowestOnlinePrice,
            getSingleBookByAsinAmazon:_getSingleBookByAsinAmazon,
            searchBooksByIsbnAmazon:_searchBooksByIsbnAmazon,
            getSingleBookByEanOnline:_getSingleBookByEanOnline,
            getAmazonCartCreateUrl:_getAmazonCartCreateUrl,
            getCampusDealsByIsbn: _getCampusDealsByIsbn,
            addSellBook:_addSellBook,
            addCustomSellBook:_addCustomSellBook,
            addBookToWishList:_addBookToWishList

        }

        function _searchBooks(data){
            if(data.access_token!=null){
                return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.SEARCH_AMAZON_API+"?access_token="+data.access_token,data);
            }else{
                return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.SEARCH_AMAZON,data);
            }

        }

        function _getLowestOnlinePrice(data){
            return apiService.get(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_LOWEST_ONLINE_PRICE+"?isbn="+data.isbn+"&ean="+data.ean);

        }

        function _searchBooksByIsbnAmazon(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_BOOK_BY_ISBN_AMAZON+"?access_token="+data.accessToken,data);
        }

        function _getSingleBookByAsinAmazon(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_BOOK_BY_ASIN_AMAZON,data);
        }

        function _getSingleBookByEanOnline(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_BOOK_BY_ISBN_ONLINE_BOOKS,data);
        }

        function _getAmazonCartCreateUrl(data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_AMAZON_CART_CREATE_URL,data);
        }

        function _getCampusDealsByIsbn(data){

            if(data.access_token!=null){
                return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_CAMPUS_DEALS_BY_ISBN_API+"?access_token="+data.access_token,data);
            }else{
                return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.GET_CAMPUS_DEALS_BY_ISBN,data);
            }

        }

        function _addSellBook(accessToken,data){

            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.ADD_NEW_SELL_BOOK+"?access_token="+accessToken,data,config);

        }
        function _addCustomSellBook(accessToken,data){

            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.ADD_NEW_CUSTOM_SELL_BOOK+"?access_token="+accessToken,data,config);

        }

        function _addBookToWishList(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+BOOK_CONSTANT.ADD_BOOK_TO_WISH_LIST+"?access_token="+accessToken,data);
        }

    }

})();
