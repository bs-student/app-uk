(function () {

    'use strict';

    app
        .controller('BookSellMainCtrl', BookSellMainCtrl);

    BookSellMainCtrl.$inject = ['$state','$scope','bookService','identityService','responseService','SERVER_CONSTANT'];

    function BookSellMainCtrl($state,$scope,bookService,identityService,responseService,SERVER_CONSTANT) {


        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Sell Books";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "sellBook";


        $scope.searchByIsbn = _searchByIsbn;

        function _searchByIsbn(valid){

            if(valid){

                $scope.isbn = $scope.isbn.replace(/-/g, "");


                if($scope.isbn.length>=10){
                    var data = {
                        'isbn':$scope.isbn,
                        'accessToken': identityService.getAccessToken()
                    };
                    ($scope.bookSearchMainPromise = bookService.searchBooksByIsbnAmazon(data)).then(function(response){

                        if(response.data.success.successData.books.length==1){
                            $state.go('app.sellBookByIsbn',{book:response.data.success.successData.books[0]});
                        }else{
                            $state.go('app.sellBookCustom');
                        }

                    }).catch(function(response){
                        if (response.data.error_description == "The access token provided is invalid.") {

                        } else if (response.data.error_description == "The access token provided has expired.") {
                            identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                                identityService.setAccessToken(response.data);
                                _searchByIsbn();
                            });
                        } else if (response.data.error != undefined) {
                            responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                        } else {
                            responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                        }
                    });
                }else{
                    responseService.showErrorToast("Wrong ISBN Provided");
                }

            }


        }
    }


})();
