(function () {

    'use strict';

    app
        .controller('BookSearchCtrl', BookSearchCtrl);

    BookSearchCtrl.$inject = ['$scope', 'bookService', 'identityService', 'imageModalService','responseService','$stateParams','$state','storageService'];

    function BookSearchCtrl($scope, bookService, identityService, imageModalService,responseService,$stateParams,$state,storageService) {

        $("body").animate({scrollTop: $("#all-search-result").offset().top-100}, "slow");

        $scope.$parent.main.title = "Search Books";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "buyBook";
        $scope.$parent.showResult = true;

        $scope.$parent.searchingProgress=true;

        $scope.goToComparePage=_goToComparePage;

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;

        $scope.viewImage = _viewImage;

        var pageNumber=0;
        init();



        function init(){
            $scope.university = storageService.getValue("universityCampusDisplay");

            if($scope.$parent.loggedIn || $scope.university){
                $scope.universitySelectedOrLoggedIn = true;
            }else{
                $scope.universitySelectedOrLoggedIn = false;
            }


            if($stateParams.searchQuery!=undefined && $stateParams.pageNumber!=undefined){

                pageNumber= parseInt($stateParams.pageNumber,10);
                if(typeof $stateParams.searchQuery == "string" && (pageNumber<100 || 0>pageNumber)){

                    var onlyIsbn =($stateParams.searchQuery.replace(/[^A-Z0-9]/ig, "").match(/^\d+$/));
                    if(onlyIsbn){
                        $stateParams.searchQuery = onlyIsbn[0];
                    }
                    var data={
                        'keyword': $stateParams.searchQuery,
                        'page': pageNumber,
                        'campus':$stateParams.campus,
                        'access_token':identityService.getAccessToken()
                    };
                    $scope.$parent.showResult = true;
                    $scope.$parent.searchText = $stateParams.searchQuery;
                    $scope.$parent.searchingError=false;
                    doSearch(data);


                }

            }
        }



        // Set Carousel
        function setCarousel() {

            $scope.thumbnailSize = 3;
            $scope.thumbnailPage = 1;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;

            angular.forEach($scope.bookSearchResult, function (book) {
                if (book.bookImages.length == 1) {
                    book.showThumb = false;
                } else {
                    book.showThumb = true;
                }

                book.showThumbnails = book.bookImages.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

            });

        }

        function _prevPage(book) {
            if ($scope.thumbnailPage > 1) {
                $scope.thumbnailPage--;
            }
            book.showThumbnails = book.bookImages.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

        }

        function _nextPage(book) {

            if ($scope.thumbnailPage <= Math.floor(book.bookImages.length / $scope.thumbnailSize)) {
                $scope.thumbnailPage++;

            }
            book.showThumbnails = book.bookImages.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

        }

        function _setActive(book, idx) {

            angular.forEach(book.showThumbnails, function (slide) {


                if (slide.imageId == idx) {
                    slide.active = true;
                }
                else {
                    slide.active = false;
                }

            });
        }


        // Set View Image
        function _viewImage(event, title) {
            imageModalService.showModal(event, title);
        }


        function doSearch(data){

            data.access_token = identityService.getAccessToken();

            $scope.$parent.searchPromise = bookService.searchBooks(data).then(function (response) {
                $scope.$parent.currentPage = pageNumber;
                $scope.bookSearchResult = response.data.success.successData.books;


                angular.forEach($scope.bookSearchResult,function(book){
                    var data = {
                        isbn:book.bookAsin,
                        ean: book.bookEan
                    };
                    (book.lowestOnlinePricePromise = bookService.getLowestOnlinePrice(data)).then(function(response){
                        book.bookPriceOnlineLowest = response.data.success.successData.bookPriceOnlineLowest;
//                        calculateLowestPrice(book);
                    }).catch(function(response){
                        book.bookPriceOnlineLowest = "Not Found";

                    });
                });

                if(parseInt(response.data.success.successData.totalSearchResults, 10)>100){
                    $scope.$parent.totalSearchResults = 101;
                    $scope.$parent.totalSearchResultsText = "More than 100";
                }else{
                    $scope.$parent.totalSearchResults = $scope.totalSearchResultsText= parseInt(response.data.success.successData.totalSearchResults, 10);

                }
                $scope.$parent.searchingProgress = false;
                $scope.$parent.searchingError=false;
                setCarousel();
            }).catch(function(response){

                if (response.data.error_description == "The access token provided is invalid.") {
                    responseService.showErrorToast("Invalid Request","You are trying to access data with invalid request");

                    $scope.$parent.bookSearchResult=0;
                    $scope.$parent.searchingProgress = false;
                    $scope.$parent.searchingError=true;

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.$parent.searchPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        doSearch(data);
                    });
                } else if (response.data.error != undefined) {
                    $scope.$parent.bookSearchResult=0;
                    $scope.$parent.searchingProgress = false;
                    $scope.$parent.searchingError=true;

                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    $scope.$parent.bookSearchResult=0;
                    $scope.$parent.searchingProgress = false;
                    $scope.$parent.searchingError=true;

                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }



            });
        }


        function _goToComparePage(book){

            angular.forEach($scope.bookSearchResult,function(resultBook){
                resultBook.lowestOnlinePricePromise.abort("Changing State");
            });

            $state.go("app.bookComparePrice",{asin:book.bookAsin,isbn:book.bookIsbn,ean:book.bookEan});
        }
        //todo Calculate Lowest Price and change the color to blue "BELOW FUNCTION IS NEEDED"
        /*function calculateLowestPrice(book){

            var lowestPrice = [];
            if(book.bookPriceAmazon!=undefined){
                var amazonPrice = (book.bookPriceAmazon).slice(1);
                lowestPrice['amazon']=amazonPrice;
            }

            if(book.bookPriceStudentLowest!=undefined){
                var studentPrice = (book.bookPriceStudentLowest).slice(1);
                lowestPrice['student']=studentPrice;
            }

            if(book.bookPriceOnlineLowest!=undefined){
                var onlinePrice = (book.bookPriceOnlineLowest).slice(1);
                lowestPrice['online']=onlinePrice;
            }




            var min = Math.min.apply(null,
                Object.keys(lowestPrice).map(function(e) {
                    return lowestPrice[e];
                }));


            Object.prototype.getKeyByValue = function( value ) {
                for( var prop in this ) {
                    if( this.hasOwnProperty( prop ) ) {
                        if( this[ prop ] == value )
                            return prop;
                    }
                }
            }

            book.lowestPriceType=lowestPrice.getKeyByValue(min);

        }*/

    }


})();


