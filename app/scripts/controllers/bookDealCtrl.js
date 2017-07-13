(function () {

    'use strict';

    app
        .controller('BookDealCtrl', BookDealCtrl);

    BookDealCtrl.$inject = ['$state','identityService', 'adminUserService', '$scope', '$filter', '$q', 'ngTableParams','responseService','adminBookDealService','SERVER_CONSTANT'];

    function BookDealCtrl($state,identityService, adminUserService, $scope, $filter, $q, ngTableParams,responseService,adminBookDealService,SERVER_CONSTANT) {


        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "All Book Deals";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";
        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.bookDeals=[];
        $scope.soldBookDeals=[];

        init();

        function init(){
            getAllBookDeals();
            getAllSoldBookDeals();
        }
        function getAllBookDeals(){
            $scope.bookDealTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        bookTitle: ''       // initial filter
                    },
                    sorting: {
                        bookSubmittedDateTime: 'desc'     // initial sorting
                    }
                },

                {
                    total: $scope.bookDeals.length, // length of data
                    getData: getBookDealData
                });



            function getBookDealData($defer, params) {

                var queryData =
                {
                    "searchQuery": params.filter().bookTitle,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.adminBookDealPromise = adminBookDealService.getAllBookDeals(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.bookDeals = response.data.success.successData.books.totalBooks;
                    $scope.bookDeals= $filter('orderBy')($scope.bookDeals, params.orderBy());
                    $defer.resolve($scope.bookDeals);
                    params.total(response.data.success.successData.books.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.adminBookDealPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getBookDealData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }

        function getAllSoldBookDeals(){
            $scope.soldBookDealTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        bookTitle: ''       // initial filter
                    },
                    sorting: {
                        bookSubmittedDateTime: 'desc'     // initial sorting
                    }
                },

                {
                    total: $scope.soldBookDeals.length, // length of data
                    getData: getSoldBookDealData
                });



            function getSoldBookDealData($defer, params) {

                var queryData =
                {
                    "searchQuery": params.filter().bookTitle,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.adminSoldBookDealPromise = adminBookDealService.getAllSoldBookDeals(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.soldBookDeals = response.data.success.successData.books.totalBooks;
                    $scope.soldBookDeals= $filter('orderBy')($scope.soldBookDeals, params.orderBy());
                    $defer.resolve($scope.soldBookDeals);
                    params.total(response.data.success.successData.books.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.adminSoldBookDealPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getSoldBookDealData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }

    }


})();


