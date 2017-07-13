(function () {

    'use strict';

    app
        .controller('AdminUniversityReportCtrl', AdminUniversityReportCtrl);

    AdminUniversityReportCtrl.$inject = ['$moment', '$timeout', '$state', 'identityService', 'adminReportService', '$scope', '$filter', '$q', 'ngTableParams', 'responseService', 'SERVER_CONSTANT'];

    function AdminUniversityReportCtrl($moment, $timeout, $state, identityService, adminReportService, $scope, $filter, $q, ngTableParams, responseService, SERVER_CONSTANT) {


        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.$parent.main.title = "University Report";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.universities=[];
        $scope.totalUniversityCount=0;
        $scope.init = _init;


        _init();

        function _init(){

            $scope.universityTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 30,           // count per page
                    filter: {
                        universityName: ''
                    }
                },

                {
                    total: $scope.universities.length, // length of data
                    getData: getUniversityData
                });


        }

        function getUniversityData($defer, params) {
            var searchData = {
                pageNumber: params.page(),
                pageSize: params.count(),
                searchQuery:params.filter().universityName
            };
            ($scope.universityDataPromise = adminReportService.getUniversitiesUserData(identityService.getAccessToken(),searchData)).then(function (response) {
                $scope.universities = response.data.success.successData.universityData.universitySearchData;
                $defer.resolve($scope.universities);
                params.total(response.data.success.successData.universityData.universityNumberData);
                $scope.totalUniversityCount=response.data.success.successData.universityData.totalUniversityCountData;

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.socialUserPiePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getUniversityData();
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


