(function () {

    'use strict';

    app
        .controller('BookCompareCtrl', BookCompareCtrl);

    BookCompareCtrl.$inject = ['$state','$stateParams','$scope','bookService','identityService','responseService','storageService','wishListService','SERVER_CONSTANT','imageModalService','$firebaseArray'];

    function BookCompareCtrl($state,$stateParams,$scope,bookService,identityService,responseService,storageService, wishListService,SERVER_CONSTANT,imageModalService,$firebaseArray) {

        $scope.$parent.main.title = "Compare Books Prices";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "buyBook";

        $scope.bookSearchResult=null;

        $scope.asin = $stateParams.asin;
        $scope.isbn = $stateParams.isbn;
        $scope.ean = $stateParams.ean;

        $scope.contact = _contact;
        $scope.saveToWishList = _saveToWishList;

        $scope.bookConditions = null;
        $scope.bookOfferId = null;
        $scope.newBooks = [];
        $scope.usedBooks = [];

        $scope.noBuyerToSeller = false;
        $scope.noSellerToBuyer = false;
        $scope.lowestPrice=null;
        $scope.campusId = storageService.getValue("universityCampusValue");
        $scope.noUniversitySelected=false;

        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;
        $scope.viewImage = _viewImage;


        init();


        function init(){

            //Get Book Data from Amazon
            getAmazonBooks();
            //Get Book Data from Ebay and Hive
            getOnlineBooks();
            //Get Book Deals
            getBookDeals();
            //Get If Wishlisted
            getIfBookWishListed();


        }

        function getAmazonBooks(){
            var amazonData = {
                asin:$scope.asin
            };
            $scope.amazonPromise = bookService.getSingleBookByAsinAmazon(amazonData).then(function(response){
                $scope.bookSearchResult=response.data.success.successData.books;
                $scope.amazonBook = response.data.success.successData.books[0];
                $scope.bookOfferId = response.data.success.successData.books[0].bookOfferId;

                checkAndSetLowestPrice(parseFloat($scope.amazonBook.bookPriceAmazon.substring(1)));

                setCarousel();

            }).catch(function(response){
                responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
            });
        }

        function getOnlineBooks(){
            var onlineBooksData = {
                isbn: $scope.isbn,
                ean: $scope.ean
            };
            $scope.onlinePromise = bookService.getSingleBookByEanOnline(onlineBooksData).then(function (response){
                if(response.data.success!=undefined){
                    $scope.bookConditions =response.data.success.successData;
                    $scope.newBooks =response.data.success.successData.New;
                    $scope.usedBooks =response.data.success.successData.Used;
                    //GET CHEAPEST ONLINE BOOK
                    getCheapestOnlineBook($scope.bookConditions);
                }
            }).catch(function(response){
                responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
            });

        }

        function getBookDeals(){

            var onCampusDealsData={
                isbn: $scope.isbn,
                access_token: identityService.getAccessToken(),
                campusId: $scope.campusId
            };
            $scope.campusPromise = bookService.getCampusDealsByIsbn(onCampusDealsData).then(function (response){
                $scope.campusBookDeals = response.data.success.successData;

                if($scope.campusBookDeals.buyerToSeller.length==0)$scope.noBuyerToSeller=true;
                if($scope.campusBookDeals.sellerToBuyer.length==0)$scope.noSellerToBuyer=true;
                if($scope.campusBookDeals.student2studentBoard.length==0)$scope.noStudent2studentBoard=true;

                if($scope.campusBookDeals.buyerToSeller.length>0 || $scope.campusBookDeals.sellerToBuyer.length>0 || $scope.campusBookDeals.student2studentBoard.length>0){
                    $scope.noBuyerToSeller = false;
                    $scope.noSellerToBuyer=false;
                    $scope.noStudent2studentBoard=false;
                    $scope.noDeals = false;
                }else{
                    $scope.noDeals = true;
                }


                if($scope.campusId==undefined && identityService.getAuthorizedUserData()==undefined){
                    $scope.noUniversitySelected=true;
                }


                //GET CHEAPEST CAMPUS DEAL
                getCheapestBookDeal($scope.campusBookDeals);

                //Adding View to Realtime Database
                var ref = firebase.database().ref("/views");
                var list = $firebaseArray(ref);

                angular.forEach($scope.campusBookDeals.buyerToSeller,function(item){
                    list.$add({bookDealId:item.bookDealId});
                });
                angular.forEach($scope.campusBookDeals.sellerToBuyer,function(item){
                    list.$add({bookDealId:item.bookDealId});
                });




            }).catch(function (response) {

                if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getBookDeals();
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }

        function getIfBookWishListed(){
            var data={
                isbn: $scope.isbn,
                accessToken: identityService.getAccessToken()
            };
            $scope.wishListPromise = wishListService.checkIfAddedIntoWishList(data).then(function (response){
                if(response.data.success.successData){
                    $scope.alreadyAddedToWishList = true;
                }else{
                    $scope.alreadyAddedToWishList = false;
                }

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided has expired.") {
                    $scope.wishListPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getIfBookWishListed();
                    });
                }else if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }

        function _contact(deal){

            if(deal==undefined){
                responseService.showErrorToast("No Books were found on campus");
            }else{
                $state.go("app.contact",{deal:deal,asin:$scope.asin,isbn:$scope.isbn,ean:$scope.ean});
            }

        }

        function _saveToWishList(){
            if($scope.$parent.loggedIn){
                wishListService.addBookToWishList(identityService.getAccessToken(),{bookId:$scope.amazonBook.bookId}).then(function(response){
                    responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                    $scope.alreadyAddedToWishList = !$scope.alreadyAddedToWishList;
                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided has expired.") {
                        identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _saveToWishList();
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }else{
                $state.go("app.login",{bookId:$scope.amazonBook.bookId});
            }

        }

        function getCheapestBookDeal(data){
            var deals=[];
            var dealPrices=[];
            angular.forEach(data.buyerToSeller,function(deal){
                deals.push(deal);
                dealPrices.push(parseFloat(deal.bookPriceSell));
            });
            angular.forEach(data.sellerToBuyer,function(deal){
                deals.push(deal);
                dealPrices.push(parseFloat(deal.bookPriceSell));
            });
            angular.forEach(data.student2studentBoard,function(deal){
                deals.push(deal);
                dealPrices.push(parseFloat(deal.bookPriceSell));
            });
            dealPrices.sort(function(a, b) { return a - b });

            angular.forEach(deals,function(deal){

                if(parseFloat(deal.bookPriceSell)==dealPrices[0]){

                    $scope.cheapestCampusDeal=deal;
                }
            });

            checkAndSetLowestPrice(dealPrices[0]);


        }

        function getCheapestOnlineBook(bookConditions){

            var books = [];
            var prices = [];
            angular.forEach(bookConditions.New,function(book){
                books.push(book);
                prices.push(parseFloat(book.price));
            });
            angular.forEach(bookConditions.Used,function(book){
                books.push(book);
                prices.push(parseFloat(book.price));
            });
            prices.sort(function(a, b) { return a - b });

            angular.forEach(books,function(book){

                if(parseFloat(book.price)==prices[0]){

                    $scope.cheapestOnlineBook=book;
                }
            });

            checkAndSetLowestPrice(prices[0]);

        }

        function checkAndSetLowestPrice(price){
            if(price>=0){
                if($scope.lowestPrice==null || price<$scope.lowestPrice)$scope.lowestPrice = price;
            }

        }


        //SET CAROUSEL FUNCTIONS
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
        function _viewImage(event, size) {
            imageModalService.showModal(event, size);
        }
    }


})();
