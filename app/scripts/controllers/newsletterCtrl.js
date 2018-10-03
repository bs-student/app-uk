(function () {

    'use strict';

    app
        .controller('NewsletterCtrl', NewsletterCtrl);

    NewsletterCtrl.$inject = ['$state','identityService', 'newsletterService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT'];

    function NewsletterCtrl($state,identityService, newsletterService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT) {


        $scope.$parent.main.title = "Newsletter";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.subscribedEmails=[];

        $scope.exportNewsletterDataIntoCSV = _exportNewsletterDataIntoCSV;

        init();

        function init(){

            getSubscribedEmails();
        }

        function getSubscribedEmails(){
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        email: ''       // initial filter
                    },
                    sorting: {
                        lastUpdateDateTime: 'desc'     // initial sorting
                    }
                },

                {
                    total: $scope.subscribedEmails.length, // length of data
                    getData: getData
                });



            function getData($defer, params) {

                var queryData =
                {
                    "searchQuery": params.filter().email,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.newsletterPromise = newsletterService.adminGetAllNewsletterEmails(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.subscribedEmails = response.data.success.successData.newsletterEmails.totalNewsletterEmails;
                    $defer.resolve($scope.subscribedEmails);
                    params.total(response.data.success.successData.newsletterEmails.totalNumber);

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


        function _exportNewsletterDataIntoCSV(){
            ($scope.newsletterPromise = newsletterService.adminExportAllDataIntoCSV(identityService.getAccessToken())).then(function (response) {

                console.log(SERVER_CONSTANT.IMAGE_HOST_PATH+response.data.success.successData.link);
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href',SERVER_CONSTANT.IMAGE_HOST_PATH+response.data.success.successData.link);
                downloadLink.attr('download', 'newsletterEmails.csv');
                downloadLink[0].click();


                responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        _exportNewsletterDataIntoCSV();
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


