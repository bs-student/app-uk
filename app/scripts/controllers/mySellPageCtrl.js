(function () {

    'use strict';

    app
        .controller('MySellPageCtrl', MySellPageCtrl);

    MySellPageCtrl.$inject = ['$scope', '$stateParams', '$state', 'identityService', 'contactService', 'responseService', 'bookDealService', 'imageModalService', 'SERVER_CONSTANT', 'wishListService'];

    function MySellPageCtrl($scope, $stateParams, $state, identityService, contactService, responseService, bookDealService, imageModalService, SERVER_CONSTANT, wishListService) {

        $scope.showPagination = false;

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "My Sell Page";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";
        $scope.resultFound = true;
        $scope.noUserFound = false;
        $scope.username = $stateParams.username;
        $scope.campusBookDeals = [];
        $scope.sortType = "bookTitle";
        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;
        $scope.viewImage = _viewImage;

        $scope.search = _search;
        $scope.saveToWishList = _saveToWishList;


        //Pagination

        $scope.changePage = _changePage;
        $scope.maxSize = 10;
        $scope.totalSearchResults = 0;
        $scope.currentPage = 1;
        $scope.searchQuery = "";

        init($scope.currentPage, $scope.searchQuery);

        // Set Carousel
        function setCarousel() {

            $scope.thumbnailSize = 3;
            $scope.thumbnailPage = 1;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;

            angular.forEach($scope.campusBookDeals, function (book) {
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


        function init(currentPage, searchQuery,type) {

            var data = {
                "pageNumber": currentPage,
                "pageSize": $scope.maxSize,
                "username": $stateParams.username,
                "keyword": searchQuery
            };
            ($scope.sellingBookPromise = bookDealService.getActivatedBookDealsOfUser(data)).then(function (response) {
                if (response.data.success.successData.result.length > 0) {
                    $scope.campusBookDeals = response.data.success.successData.result;
                    $scope.user = response.data.success.successData.userData;
                    $scope.totalSearchResults = response.data.success.successData.totalNumber;
                    $scope.showPagination = true;
                    $scope.resultFound = true;
                    setCarousel();
                } else {
                    $scope.resultFound = false;
                    $scope.totalSearchResults =0;
                    $scope.campusBookDeals=[];
                }
                if(type=="search"){
                    $scope.resultFound = true;

                }

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        init(currentPage);
                    });
                } else if (response.data.error != undefined) {
                    $scope.noUserFound = true;
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });


        }

        function _changePage(currentPage) {

            var data = {
                "pageNumber": currentPage,
                "pageSize": $scope.maxSize
            };

            ($scope.sellingBookPromise = bookDealService.getBookDealsOfMine(identityService.getAccessToken(), data)).then(function (response) {
                $scope.campusBookDeals = response.data.success.successData.result;
                $scope.totalSearchResults = response.data.success.successData.totalNumber;
                setCarousel();


            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        _changePage(currentPage)
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });


        }

        function _search(searchQuery) {
            init(1, searchQuery,"search");
        }

        function _saveToWishList(deal) {
            if ($scope.$parent.loggedIn) {
                ($scope.sellingBookPromise = wishListService.addBookToWishList(identityService.getAccessToken(), {bookId: deal.bookId})).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided has expired.") {
                        identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _saveToWishList(deal)
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            } else {
                $state.go("app.login", {bookId: deal.bookId});
            }

        }


    }


})();


