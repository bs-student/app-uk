(function () {

    'use strict';

    app
        .controller('AdminBookDealReportCtrl', AdminBookDealReportCtrl);

    AdminBookDealReportCtrl.$inject = ['$moment', '$timeout', '$state', 'identityService', 'adminReportService', '$scope', '$filter', '$q', 'ngTableParams', 'responseService', 'SERVER_CONSTANT'];

    function AdminBookDealReportCtrl($moment, $timeout, $state, identityService, adminReportService, $scope, $filter, $q, ngTableParams, responseService, SERVER_CONSTANT) {


        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.$parent.main.title = "Book Deal Report";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.init = _init;

        $scope.startDate = $moment().subtract(6, 'days').format('MMMM D, YYYY');
        $scope.endDate = $moment().format('MMMM D, YYYY');
        $scope.rangeOptions = {
            ranges: {
                Today: [$moment(), $moment()],
                Yesterday: [$moment().subtract(1, 'days'), $moment().subtract(1, 'days')],
                'Last 7 Days': [$moment().subtract(6, 'days'), $moment()],
                'Last 30 Days': [$moment().subtract(29, 'days'), $moment()],
                'This Month': [$moment().startOf('month'), $moment().endOf('month')],
                'Last Month': [$moment().subtract(1, 'month').startOf('month'), $moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            startDate: $moment().subtract(6, 'days'),
            endDate: $moment(),
            parentEl: '#content'
        };



        $scope.bookDealMethodPieChartLabels = ["Buyer To Seller", "Seller To Buyer", "Message Board"];
        $scope.bookDealMethodPieChartData = [0, 0, 0];

        $scope.loggedInAndRegisteredLineOnClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.loggedInAndRegisteredLineDatasetOverride = [
            { yAxisID: 'y-axis-1' }
        ];
        $scope.loggedInAndRegisteredLineOptions = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        };


        $scope.bookDealAndContactLineLabels = [];
        $scope.bookDealAndContactLineSeries = ['Book Deal', 'Contact','Sold Deal'];
        $scope.bookDealAndContactLineData = [];






        _init();

        function _init(){
            getBookDealAndContactDataWithDateRange();
            getBookDealMethodDataWithDateRange();

        }



        function getBookDealAndContactDataWithDateRange(){
            var userData = {
                startDate: $scope.startDate,
                endDate: $scope.endDate
            };

            ($scope.bookDealAndContactLinePromise = adminReportService.getBookDealAndContactData(identityService.getAccessToken(), userData)).then(function (response) {
                $scope.bookDealAndContactLineLabels = response.data.success.successData.bookDealData.dateData;
                $scope.bookDealAndContactLineData=[response.data.success.successData.bookDealData.bookDealData,response.data.success.successData.bookDealData.contactData,response.data.success.successData.bookDealData.soldData];
                $scope.createdBookDeals = response.data.success.successData.bookDealData.createdBookDeals;
                $scope.soldBookDeals = response.data.success.successData.bookDealData.soldBookDeals;

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.bookDealAndContactLinePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getBookDealAndContactDataWithDateRange();
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, errorDescription + ". " + response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }

        function getBookDealMethodDataWithDateRange(){
            var userData = {
                startDate: $scope.startDate,
                endDate: $scope.endDate
            };

            ($scope.bookDealMthodPiePromise = adminReportService.getBookDealMethodData(identityService.getAccessToken(), userData)).then(function (response) {

                $scope.bookDealMethodPieChartData = [
                    parseInt(response.data.success.successData.bookDealData.buyerToSellerDeals, 10),
                    parseInt(response.data.success.successData.bookDealData.sellerToBuyerDeals, 10),
                    parseInt(response.data.success.successData.bookDealData.messageBoardDeals, 10)];

                $scope.bookDealMethodRows = parseInt(response.data.success.successData.bookDealData.buyerToSellerDeals, 10) +
                    parseInt(response.data.success.successData.bookDealData.sellerToBuyerDeals, 10) +
                    parseInt(response.data.success.successData.bookDealData.messageBoardDeals, 10);

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.bookDealMthodPiePromise  = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getBookDealMethodDataWithDateRange();
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, errorDescription + ". " + response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }


    }


})();


