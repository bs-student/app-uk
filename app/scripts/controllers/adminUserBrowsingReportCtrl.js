(function () {

    'use strict';

    app
        .controller('AdminUserBrowsingReportCtrl', AdminUserBrowsingReportCtrl);

    AdminUserBrowsingReportCtrl.$inject = ['$moment', '$timeout', '$state', 'identityService', 'adminReportService', '$scope', '$filter', '$q', 'ngTableParams', 'responseService', 'SERVER_CONSTANT', 'GOOGLE_ANALYTICS_CONSTANT'];

    function AdminUserBrowsingReportCtrl($moment, $timeout, $state, identityService, adminReportService, $scope, $filter, $q, ngTableParams, responseService, SERVER_CONSTANT, GOOGLE_ANALYTICS_CONSTANT) {

        $scope.accessTokenGoogleServiceAccount = undefined;
        $scope.gaViewId = GOOGLE_ANALYTICS_CONSTANT.GA_ID;

        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.$parent.main.title = "User Browsing Report";
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


        _init();

        function _init() {

            $scope.startDateGoogleFormat = moment($scope.startDate, 'MMMM D, YYYY').format('YYYY-MM-DD');
            $scope.endDateGoogleFormat = moment($scope.endDate, 'MMMM D, YYYY').format('YYYY-MM-DD');

            if ($scope.accessTokenGoogleServiceAccount == undefined) {
                ($scope.googleAccessTokenPromise = adminReportService.getGoogleAccessToken(identityService.getAccessToken())).then(function (response) {
                    $scope.accessTokenGoogleServiceAccount = response.data.success.successData.accessToken.access_token;

                    gapi.analytics.auth.authorize({
                        'serverAuth': {
                            'access_token': $scope.accessTokenGoogleServiceAccount
                        }
                    });

                    getUserDeviceCategoryReport();
                    getUserBrowserHistoryReport();
                    getUserOsReport();
                    getUserDeviceReport();
                    getUserDeviceBrandReport();

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
                getUserDeviceCategoryReport();
                getUserBrowserHistoryReport();
                getUserOsReport();
                getUserDeviceReport();
                getUserDeviceBrandReport();
            }

        }

        function getUserDeviceCategoryReport() {
            var userQueryData = query({
                'ids': $scope.gaViewId,
                'dimensions': 'ga:deviceCategory',
                'metrics': 'ga:users',
                'start-date': $scope.startDateGoogleFormat,
                'end-date': $scope.endDateGoogleFormat
            });
            Promise.all([userQueryData]).then(function (results) {

                var browsers = results[0].rows.map(function (row) {
                    return row[0];
                });
                var browserUsers = results[0].rows.map(function (row) {
                    return row[1];
                });

                var data = {
                    labels: browsers,
                    datasets: [
                        {
                            data: browserUsers,
                            backgroundColor: ['#9B2437', '#F4A933', '#3b5d8e'],
                            borderWidth: 1
                        }
                    ]
                };

                new Chart(makeCanvas('user-device-category-pie-chart-container', 300), {
                    type: "doughnut",
                    data: data
                });

            });

        }

        function getUserBrowserHistoryReport() {
            var userQueryData = query({
                'ids': $scope.gaViewId,
                'dimensions': 'ga:browser',
                'metrics': 'ga:users',
                'start-date': $scope.startDateGoogleFormat,
                'end-date': $scope.endDateGoogleFormat
            });
            Promise.all([userQueryData]).then(function (results) {

                var browsers = results[0].rows.map(function (row) {
                    return row[0];
                });
                var browserUsers = results[0].rows.map(function (row) {
                    return row[1];
                });

                var data = {
                    labels: browsers,
                    datasets: [
                        {
                            label: 'Brosers',
                            fillColor: 'rgba(68,157,68,1)',
                            strokeColor: 'rgba(68,157,68,1)',
                            pointColor: 'rgba(68,157,68,1)',
                            pointStrokeColor: '#fff',
                            data: browserUsers,
                            backgroundColor: 'rgba(68, 157, 68,.2)',
                            borderColor: 'rgba(68,157,68,1)',
                            borderWidth: 1
                        }
                    ]
                };

                new Chart(makeCanvas('user-browser-bar-chart-container', 300), {
                    type: "bar",
                    data: data
                });
                generateLegend('user-browser-bar-chart-legend-container', data.datasets);

            });

        }

        function getUserOsReport() {
            var userQueryData = query({
                'ids': $scope.gaViewId,
                'dimensions': 'ga:operatingSystem',
                'metrics': 'ga:users',
                'start-date': $scope.startDateGoogleFormat,
                'end-date': $scope.endDateGoogleFormat
            });
            Promise.all([userQueryData]).then(function (results) {

                var os = results[0].rows.map(function (row) {
                    return row[0];
                });
                var osUsers = results[0].rows.map(function (row) {
                    return row[1];
                });

                var data = {
                    labels: os,
                    datasets: [
                        {
                            label: 'Operating Systems',
                            fillColor: 'rgba(68,157,68,1)',
                            strokeColor: 'rgba(68,157,68,1)',
                            pointColor: 'rgba(68,157,68,1)',
                            pointStrokeColor: '#fff',
                            data: osUsers,
                            backgroundColor: 'rgba(68, 157, 68,.2)',
                            borderColor: 'rgba(68,157,68,1)',
                            borderWidth: 1
                        }
                    ]
                };

                new Chart(makeCanvas('user-os-bar-chart-container', 300), {
                    type: "bar",
                    data: data
                });
                generateLegend('user-os-bar-chart-legend-container', data.datasets);

            });

        }

        function getUserDeviceBrandReport() {
            var userQueryData = query({
                'ids': $scope.gaViewId,
                'dimensions': 'ga:mobileDeviceBranding',
                'metrics': 'ga:users',
                'start-date': $scope.startDateGoogleFormat,
                'end-date': $scope.endDateGoogleFormat
            });
            Promise.all([userQueryData]).then(function (results) {

                var devices = results[0].rows.map(function (row) {
                    return row[0];
                });
                var devicesUsers = results[0].rows.map(function (row) {
                    return row[1];
                });

                var data = {
                    labels: devices,
                    datasets: [
                        {
                            label: 'Mobile Devices',
                            fillColor: 'rgba(68,157,68,1)',
                            strokeColor: 'rgba(68,157,68,1)',
                            pointColor: 'rgba(68,157,68,1)',
                            pointStrokeColor: '#fff',
                            data: devicesUsers,
                            backgroundColor: 'rgba(68, 157, 68,.2)',
                            borderColor: 'rgba(68,157,68,1)',
                            borderWidth: 1
                        }
                    ]
                };

                new Chart(makeCanvas('user-device-brand-bar-chart-container', devicesUsers.length * 25), {
                    type: "horizontalBar",
                    data: data
                });
                generateLegend('user-device-brand-bar-chart-legend-container', data.datasets);

            });

        }

        function getUserDeviceReport() {
            var userQueryData = query({
                'ids': $scope.gaViewId,
                'dimensions': 'ga:mobileDeviceInfo',
                'metrics': 'ga:users',
                'start-date': $scope.startDateGoogleFormat,
                'end-date': $scope.endDateGoogleFormat
            });
            Promise.all([userQueryData]).then(function (results) {

                var devices = results[0].rows.map(function (row) {
                    return row[0];
                });
                var devicesUsers = results[0].rows.map(function (row) {
                    return row[1];
                });

                var data = {
                    labels: devices,
                    datasets: [
                        {
                            label: 'Mobile Devices',
                            fillColor: 'rgba(68,157,68,1)',
                            strokeColor: 'rgba(68,157,68,1)',
                            pointColor: 'rgba(68,157,68,1)',
                            pointStrokeColor: '#fff',
                            data: devicesUsers,
                            backgroundColor: 'rgba(68, 157, 68,.2)',
                            borderColor: 'rgba(68,157,68,1)',
                            borderWidth: 1
                        }
                    ]
                };

                new Chart(makeCanvas('user-device-bar-chart-container', devicesUsers.length * 17), {
                    type: "horizontalBar",
                    data: data
                });
                generateLegend('user-device-bar-chart-legend-container', data.datasets);

            });

        }


        /**
         * Extend the Embed APIs `gapi.analytics.report.Data` component to
         * return a promise the is fulfilled with the value returned by the API.
         * @param {Object} params The request parameters.
         * @return {Promise} A promise.
         */
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

        /**
         * Create a new canvas inside the specified element. Set it to be the width
         * and height of its container.
         * @param {string} id The id attribute of the element to host the canvas.
         * @return {RenderingContext} The 2D canvas context.
         */
        function makeCanvas(id, height) {

            var container = document.getElementById(id);
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            container.innerHTML = '';
            canvas.width = container.offsetWidth;
            if(height!=undefined){
                canvas.height = height;
            }else{
                canvas.height = container.offsetHeight;
            }
            container.appendChild(canvas);

            return ctx;
        }

        /**
         * Create a visual legend inside the specified element based off of a
         * Chart.js dataset.
         * @param {string} id The id attribute of the element to host the legend.
         * @param {Array.<Object>} items A list of labels and colors for the legend.
         */
        function generateLegend(id, items) {
            var legend = document.getElementById(id);
            legend.innerHTML = items.map(function (item) {
                var color = item.color || item.fillColor;
                var label = item.label;
                return '<li><i style="background:' + color + '"></i>' +
                    escapeHtml(label) + '</li>';
            }).join('');
        }


        // Set some global Chart.js defaults.
        Chart.defaults.global.animationSteps = 60;
        Chart.defaults.global.animationEasing = 'easeInOutQuart';
        Chart.defaults.global.responsive = true;
        Chart.defaults.global.maintainAspectRatio = true;


        /**
         * Escapes a potentially unsafe HTML string.
         * @param {string} str An string that may contain HTML entities.
         * @return {string} The HTML-escaped string.
         */
        function escapeHtml(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }


    }


})();


