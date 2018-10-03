(function () {

    'use strict';

    app
        .controller('UniversityMergeCtrl', UniversityMergeCtrl);

    UniversityMergeCtrl.$inject = ['$stateParams', 'identityService', 'adminUniversityService', '$scope', 'responseService', 'countryService', 'stateService','$state','ngTableParams','imageModalService'];

    function UniversityMergeCtrl($stateParams, identityService, adminUniversityService, $scope, responseService, countryService, stateService,$state,ngTableParams,imageModalService) {


        $scope.$parent.main.title = "Merge University";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";


        $scope.showMergeUniversityModal = _showMergeUniversityModal;
        $scope.mergeUniversity = _mergeUniversity;

        $scope.similarUniversities = [];
        $scope.universities = [];
        $scope.universities.push($stateParams.university);

        init();

        function init(){
            $scope.similarTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        universityName: $scope.universities[0].universityName // initial filter
                    },
                    sorting: {
                        creationDateTime: 'desc'// initial sorting
                    }
                },

                {
                    total: $scope.similarUniversities.length, // length of data
                    getData: getData
                });

            function getData($defer, params) {
                var queryData =
                {
                    "universityId":$scope.universities[0].universityId,
                    "searchQuery": params.filter().universityName,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort": params.sorting()
                };

                ($scope.universityPromise = adminUniversityService.getSimilarUniversities(identityService.getAccessToken(), queryData)).then(function (response) {

                    $scope.similarUniversities = response.data.success.successData.universities.totalUniversities;
                    $defer.resolve($scope.similarUniversities);
                    params.total(response.data.success.successData.universities.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.universityPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
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

        function _showMergeUniversityModal(event, modalTemplate,data){
            imageModalService.showPromptModal(event, modalTemplate,data,$scope);
        }

        function _mergeUniversity(paramData){

            var queryData =
            {
                "mergeFromUniversityId":$scope.universities[0].universityId,
                "mergeToUniversityId":paramData.university.universityId
            };

                ($scope.universityPromise = adminUniversityService.mergeUniversities(identityService.getAccessToken(),queryData)).then(function(response){
                    responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                    $state.go("app.universityManagement");
                }).catch(function(response){

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        (identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _mergeUniversity(paramData);
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


