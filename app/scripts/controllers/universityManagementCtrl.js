(function () {

    'use strict';

    app
        .controller('UniversityManagementCtrl', UniversityManagementCtrl);

    UniversityManagementCtrl.$inject = ['$state', 'identityService', 'adminUniversityService', '$scope', '$filter', '$q', 'ngTableParams', 'responseService'];

    function UniversityManagementCtrl($state, identityService, adminUniversityService, $scope, $filter, $q, ngTableParams, responseService) {


        $scope.$parent.main.title = "University Management";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.editRow = _editRow;
        $scope.cancelEditRow = _cancelEditRow;
        $scope.saveEditedRow = _saveEditedRow;
        $scope.approveSelectedUniversities = _approveSelectedUniversities;
        $scope.addOrRemoveSelectedUniversities = _addOrRemoveSelectedUniversities;

        var selectedUniversityList = [];
        var selected_all = false;
        $scope.checkboxes = { 'checked': false, items: {} };

        $scope.nonApprovedUniversities = [];
        $scope.activatedUniversities = [];
        $scope.deactivatedUniversities = [];

        init();

        function init() {
            selectedUniversityList = [];
            getPendingUniversities();
            getActivatedUniversities();
            getDeactivatedUniversities();
        }


        function getPendingUniversities() {
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        universityName: '' // initial filter
                    },
                    sorting: {
                        creationDateTime: 'desc'// initial sorting
                    }
                },

                {
                    total: $scope.nonApprovedUniversities.length, // length of data
                    getData: getData
                });

            function getData($defer, params) {
                var queryData =
                {
                    "searchQuery": params.filter().universityName,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort": params.sorting()
                };

                ($scope.universityPromise = adminUniversityService.getAllNonApprovedUniversities(identityService.getAccessToken(), queryData)).then(function (response) {

                    $scope.nonApprovedUniversities = response.data.success.successData.universities.totalUniversities;
                    $defer.resolve($scope.nonApprovedUniversities);
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


        function getActivatedUniversities() {

            $scope.activatedTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        universityName: '' // initial filter
                    },
                    sorting: {
                        creationDateTime: 'desc'// initial sorting
                    }
                },

                {
                    total: $scope.activatedUniversities.length, // length of data
                    getData: getData
                });

            function getData($defer, params) {
                var queryData =
                {
                    "searchQuery": params.filter().universityName,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort": params.sorting()
                };

                ($scope.activatedUniversityPromise = adminUniversityService.getAllActivatedUniversities(identityService.getAccessToken(), queryData)).then(function (response) {

                    $scope.activatedUniversities = response.data.success.successData.universities.totalUniversities;
                    $defer.resolve($scope.activatedUniversities);
                    params.total(response.data.success.successData.universities.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.activatedUniversityPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
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

        function getDeactivatedUniversities() {

            $scope.deactivatedTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        universityName: '' // initial filter
                    },
                    sorting: {
                        creationDateTime: 'desc'// initial sorting
                    }
                },

                {
                    total: $scope.deactivatedUniversities.length, // length of data
                    getData: getData
                });

            function getData($defer, params) {
                var queryData =
                {
                    "searchQuery": params.filter().universityName,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort": params.sorting()
                };

                ($scope.deactivatedUniversityPromise = adminUniversityService.getAllDeactivatedUniversities(identityService.getAccessToken(), queryData)).then(function (response) {

                    $scope.deactivatedUniversities = response.data.success.successData.universities.totalUniversities;
                    $defer.resolve($scope.deactivatedUniversities);
                    params.total(response.data.success.successData.universities.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.deactivatedUniversityPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
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


        function _editRow(row) {
            row.$edit = true;
            row.universityNameOnEdit = row.universityName;
            row.universityUrlOnEdit = row.universityUrl;
            row.universityStatusOnEdit = row.universityStatus;
        }

        function _cancelEditRow(row) {
            row.$edit = false;
            row.universityName = row.universityNameOnEdit;
            row.universityUrl = row.universityUrlOnEdit;
            row.universityStatus = row.universityStatusOnEdit;
        }

        function _saveEditedRow(valid, row, approved) {

            if (valid) {
                row.$edit = false;

                if(approved){
                    row.adminApproved = "Yes";
                }else{
                    row.adminApproved = "No";
                }


                ($scope.universityPromise = adminUniversityService.saveEditedUniversityDataOnly(identityService.getAccessToken(), row)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                    if(row.adminApproved=="Yes"){
                        if($scope.nonApprovedUniversities.indexOf(row)>=0){
                            $scope.nonApprovedUniversities.splice($scope.nonApprovedUniversities.indexOf(row),1);
                        }else if($scope.activatedUniversities.indexOf(row)>=0){
                            $scope.activatedUniversities.splice($scope.activatedUniversities.indexOf(row),1);
                        }else if($scope.deactivatedUniversities.indexOf(row)>=0){
                            $scope.deactivatedUniversities.splice($scope.deactivatedUniversities.indexOf(row),1);
                        }


                        if(row.universityStatus=="Activated"){
                            $scope.activatedUniversities.push(row);
                        }else if(row.universityStatus=="Deactivated"){
                            $scope.deactivatedUniversities.push(row);
                        }
                    }



                }).catch(function (response) {
                    row.universityName = row.universityNameOnEdit;
                    row.universityUrl = row.universityUrlOnEdit;
                    row.universityStatus = row.universityStatusOnEdit;
                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.universityPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _saveEditedRow(valid, row);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }



        // watch for check all checkbox
        $scope.$watch('checkboxes.checked', function (value) {

            selected_all = value;
            angular.forEach($scope.nonApprovedUniversities, function (item) {
                if (angular.isDefined(item.universityId)) {
                    $scope.checkboxes.items[item.universityId] = value;
                }
            });

            if(value){
                selectedUniversityList=[];
                angular.forEach($scope.nonApprovedUniversities, function (item) {
                    selectedUniversityList.push(item);
                });
            }else{
                selectedUniversityList=[];
            }

        });


        function _approveSelectedUniversities(){

            if(selectedUniversityList.length>0){

                ($scope.universityPromise = adminUniversityService.approveMultipleUniversities(identityService.getAccessToken(),selectedUniversityList)).then(function(response){

                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                    init();
                }).catch(function(response){
                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.universityPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _approveSelectedUniversities();
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }
                });
            }


        }
        function _addOrRemoveSelectedUniversities(row) {
            if (selectedUniversityList.indexOf(row) > -1) {
                selectedUniversityList.splice(selectedUniversityList.indexOf(row), 1);
            } else {
                selectedUniversityList.push(row);
            }
        }



    }


})();


