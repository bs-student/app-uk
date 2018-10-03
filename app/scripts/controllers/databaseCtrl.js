(function () {

    'use strict';

    app
        .controller('DatabaseCtrl', DatabaseCtrl);

    DatabaseCtrl.$inject = ['$state','identityService', 'newsletterService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT','adminDatabaseService'];

    function DatabaseCtrl($state,identityService, newsletterService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT,adminDatabaseService) {


        $scope.$parent.main.title = "Database";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.databaseList=[];

        $scope.downloadDatabase = _downloadDatabase;

        init();

        function init(){

            getDatabaseList();
        }

        function getDatabaseList(){
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10           // count per page
                },

                {
                    total: $scope.databaseList.length, // length of data
                    getData: getData
                });



            function getData($defer, params) {

                var queryData =
                {

                    "pageNumber": params.page(),
                    "pageSize": params.count()

                };
                ($scope.databasePromise = adminDatabaseService.adminGetAllDatabaseList(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.databaseList = response.data.success.successData.databaseList.totalDatabaseList;
                    $defer.resolve($scope.databaseList);
                    params.total(response.data.success.successData.databaseList.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }


        function _downloadDatabase(databaseName){

            var queryData =
            {
                "databaseName": databaseName
            };

            ($scope.databasePromise = adminDatabaseService.adminDownloadDatabase(identityService.getAccessToken(),queryData)).then(function (response) {

                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href',SERVER_CONSTANT.IMAGE_HOST_PATH+response.data.success.successData.link);
                downloadLink.attr('download', databaseName);
                downloadLink[0].click();
                responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        _downloadDatabase(databaseName);
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }


    }


})();


