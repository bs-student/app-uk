(function () {

    'use strict';

    app
        .controller('AdminUserReportCtrl', AdminUserReportCtrl);

    AdminUserReportCtrl.$inject = ['$moment', '$timeout', '$state', 'identityService', 'adminReportService', '$scope', '$filter', '$q', 'ngTableParams', 'responseService', 'SERVER_CONSTANT','GOOGLE_ANALYTICS_CONSTANT'];

    function AdminUserReportCtrl($moment, $timeout, $state, identityService, adminReportService, $scope, $filter, $q, ngTableParams, responseService, SERVER_CONSTANT,GOOGLE_ANALYTICS_CONSTANT) {

        $scope.accessTokenGoogleServiceAccount = undefined;
        $scope.totalVisitors = 0;
        $scope.totalPageViews = 0;
        $scope.gaViewId = GOOGLE_ANALYTICS_CONSTANT.GA_ID;

        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.$parent.main.title = "User Report";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.init = _init;

        $scope.startDate = $moment().subtract(6, 'days').format('MMMM D, YYYY');
        $scope.endDate = $moment().format('MMMM D, YYYY');
        $scope.startDateGoogleFormat = $moment().subtract(6, 'days').format('YYYY-MM-DD');
        $scope.endDateGoogleFormat = $moment().format('YYYY-MM-DD');

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


        $scope.socialUsersPieChartLabels = ["Normal Registered Users", "Facebook Users", "Google Users"];
        $scope.socialUsersPieChartData = [0, 0, 0];


        $scope.loggedInAndRegisteredLineLabels = [];
        $scope.loggedInAndRegisteredLineSeries = ['Logged In', 'Registered'];
        $scope.loggedInAndRegisteredLineData = [];
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




        _init();

        function _init(){
            getUserVisitDataWithDateRange();
            getNormalAndSocialUserDataWithDateRange();
            getLoginAndRegisteredUserDataWithDateRange();

        }

        function getUserVisitDataWithDateRange(){

            $scope.startDateGoogleFormat = moment($scope.startDate, 'MMMM D, YYYY').format('YYYY-MM-DD');
            $scope.endDateGoogleFormat = moment($scope.endDate, 'MMMM D, YYYY').format('YYYY-MM-DD');


            if ($scope.accessTokenGoogleServiceAccount == undefined) {
                ($scope.googleAccessTokenPromise = adminReportService.getGoogleAccessToken(identityService.getAccessToken())).then(function (response) {
                    $scope.accessTokenGoogleServiceAccount = response.data.success.successData.accessToken.access_token;
                    getUserVisitGoogleAnalytics();

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.googleAccessTokenPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _init();
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, errorDescription + ". " + response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            } else {
                getUserVisitGoogleAnalytics();
            }
        }

        function getUserVisitGoogleAnalytics(){
            var userQueryData = query({
                'ids': $scope.gaViewId,
                'metrics': 'ga:users,ga:pageviews',
                'start-date': $scope.startDateGoogleFormat,
                'end-date': $scope.endDateGoogleFormat
            });

            gapi.analytics.auth.authorize({
                'serverAuth': {
                    'access_token': $scope.accessTokenGoogleServiceAccount
                }
            });
            Promise.all([userQueryData]).then(function (results) {
                $scope.totalVisitors = results[0].rows[0][0];
                $scope.totalPageViews = results[0].rows[0][1];
            });

        }
        function query(params) {
            return new Promise(function (resolve, reject) {
                var data = new gapi.analytics.report.Data({query: params});
                data.once('success', function (response) {
                    resolve(response);
                })
                    .once('error', function (response) {
                        reject(response);
                    })
                    .execute();
            });
        }

        function getNormalAndSocialUserDataWithDateRange() {
            var userData = {
                startDate: $scope.startDate,
                endDate: $scope.endDate
            };

            ($scope.socialUserPiePromise = adminReportService.getNormalAndSocialUserData(identityService.getAccessToken(), userData)).then(function (response) {

                $scope.totalUserCount = response.data.success.successData.userData.totalActiveUsers;
                $scope.totalSocialUserCount = response.data.success.successData.userData.totalActiveSocialUsers;
                $scope.socialUsersPieChartData = [
                    parseInt(response.data.success.successData.userData.activeNormalUsers, 10),
                    parseInt(response.data.success.successData.userData.activeFacebookUsers, 10),
                    parseInt(response.data.success.successData.userData.activeGoogleUsers, 10)];

                $scope.pieChartUsers = parseInt(response.data.success.successData.userData.activeNormalUsers, 10) +
                    parseInt(response.data.success.successData.userData.activeFacebookUsers, 10) +
                    parseInt(response.data.success.successData.userData.activeGoogleUsers, 10);

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.socialUserPiePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getNormalAndSocialUserDataWithDateRange();
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, errorDescription + ". " + response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }


        function getLoginAndRegisteredUserDataWithDateRange(){
            var userData = {
                startDate: $scope.startDate,
                endDate: $scope.endDate
            };

            ($scope.loggedInAndRegisteredUserLinePromise = adminReportService.getLoginAndRegistrationUserData(identityService.getAccessToken(), userData)).then(function (response) {
                $scope.loggedInAndRegisteredLineLabels = response.data.success.successData.userData.dateData;
                $scope.loggedInAndRegisteredLineData=[response.data.success.successData.userData.loginData,response.data.success.successData.userData.registrationData];

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.loggedInAndRegisteredUserLinePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getLoginAndRegisteredUserDataWithDateRange();
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


