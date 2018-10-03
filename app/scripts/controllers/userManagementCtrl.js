(function () {

    'use strict';

    app
        .controller('UserManagementCtrl', UserManagementCtrl);

    UserManagementCtrl.$inject = ['$state','identityService', 'adminUserService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT'];

    function UserManagementCtrl($state,identityService, adminUserService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT) {


        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.$parent.main.title = "User Management";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.editRow=_editRow;
        $scope.cancelEditRow=_cancelEditRow;
        $scope.saveEditedRow = _saveEditedRow;
        $scope.approveSelectedUsers = _approveSelectedUsers;

        $scope.addOrRemoveSelectedUsers = _addOrRemoveSelectedUsers;

        var selectedUserList = [];
        var selected_all = false;
        $scope.checkboxes = { 'checked': false, items: {} };

        $scope.nonApprovedUsers=[];
        $scope.approvedUsers=[];
        $scope.adminUsers=[];

        $scope.emailVerifiedStatus = [
            {
                'title':"Yes",
                'id':"Yes"
            },
            {
                'title':"No",
                'id':"No"
            }
        ];

        $scope.adminApprovedStatus = [
            {
                'title':"Approved",
                'id':"Yes"
            },
            {
                'title':"Disapproved",
                'id':"No"
            }
        ];

        $scope.userType = [
            {
                'title':"Google",
                'id':"Google"
            },
            {
                'title':"Facebook",
                'id':"Facebook"
            },
            {
                'title':"Normal",
                'id':"Normal"
            }
        ];

        init();

        function init(){
            selectedUserList=[];
            getPendingUsers();
            getApprovedUsers();
            getAdminUsers();
        }
        function getPendingUsers(){
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        username: '',
                        email: '',           // initial filter
                        fullName: '',
                        emailVerified: '',
                        userType:''
                    },
                    sorting: {
                        registrationDateTime: 'desc'// initial sorting
                    }
                },

                {
                    total: $scope.nonApprovedUsers.length, // length of data
                    getData: getData
                });



            function getData($defer, params) {

                var queryData =
                {
                    "usernameQuery": params.filter().username,
                    "emailQuery": params.filter().email,
                    "fullNameQuery": params.filter().fullName,
                    "emailVerifiedQuery": params.filter().emailVerified,
                    "typeQuery": params.filter().userType,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.userPromise = adminUserService.getAllNonApprovedUsers(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.nonApprovedUsers = response.data.success.successData.users.totalUsers;
                    $defer.resolve($scope.nonApprovedUsers);
                    params.total(response.data.success.successData.users.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.userPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
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

        function getApprovedUsers(){
            $scope.approvedTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        username: ''  ,
                        email: '',
                        fullName:'',
                        universityName:'',
                        campusName:'',
                        emailVerified:'',
                        adminApproved:'',
                        userType:''
                    },
                    sorting: {
                        registrationDateTime: 'desc'     // initial sorting
                    }
                },

                {
                    total: $scope.approvedUsers.length, // length of data
                    getData: getApprovedData
                });



            function getApprovedData($defer, params) {

                var queryData =
                {
                    "usernameQuery": params.filter().username,
                    "emailQuery": params.filter().email,
                    "fullNameQuery": params.filter().fullName,
                    "universityNameQuery": params.filter().universityName,
                    "campusNameQuery": params.filter().campusName,
                    "emailVerifiedQuery": params.filter().emailVerified,
                    "adminApprovedQuery": params.filter().adminApproved,
                    "typeQuery": params.filter().userType,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.userPromise = adminUserService.getAllApprovedUsers(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.approvedUsers = response.data.success.successData.users.totalUsers;
//                    $scope.approvedUsers= $filter('orderBy')($scope.approvedUsers, params.orderBy());
                    $defer.resolve($scope.approvedUsers);
                    params.total(response.data.success.successData.users.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.userPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getApprovedData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }

        function getAdminUsers(){
            $scope.adminTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        username: '',
                        email: ''          // initial filter
                    },
                    sorting: {
                        username: 'asc'     // initial sorting
                    }
                },

                {
                    total: $scope.adminUsers.length, // length of data
                    getData: getAdminData
                });



            function getAdminData($defer, params) {

                var queryData =
                {
                    "usernameQuery": params.filter().username,
                    "emailQuery": params.filter().email,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.userPromise = adminUserService.getAllAdminUsers(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.adminUsers = response.data.success.successData.users.totalUsers;
//                    $scope.adminUsers= $filter('orderBy')($scope.adminUsers, params.orderBy());
                    $defer.resolve($scope.adminUsers);
                    params.total(response.data.success.successData.users.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.userPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getAdminData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }


        function _editRow(row){
            row.$edit = true;
            row.usernameOnEdit = row.username ;
            row.adminVerifiedOnEdit = row.adminVerified;
            row.adminApprovedOnEdit = row.adminApproved;
        }
        function _cancelEditRow(row){
            row.$edit = false;
            row.username =  row.usernameOnEdit;
            row.adminVerified = row.adminVerifiedOnEdit;
            row.adminApproved = row.adminApprovedOnEdit;
        }

        function _saveEditedRow(valid,row){

            if(valid){
                row.$edit=false;
                row.adminVerified = "Yes";
                ($scope.userPromise = adminUserService.saveUpdatedUserDataAdmin(identityService.getAccessToken(),row)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                    $scope.nonApprovedUsers.splice($scope.nonApprovedUsers.indexOf(row),1);

                }).catch(function (response) {
                    row.username =  row.usernameOnEdit;
                    row.enabled = row.statusOnEdit;
                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.userPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _saveEditedRow(valid,row);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });

            }

        }

        function _addOrRemoveSelectedUsers(user){
            if (selectedUserList.indexOf(user) > -1) {
                selectedUserList.splice(selectedUserList.indexOf(user), 1);
            } else {
                selectedUserList.push(user);
            }
        }
        // watch for check all checkbox
        $scope.$watch('checkboxes.checked', function (value) {

            selected_all = value;
            angular.forEach($scope.nonApprovedUsers, function (item) {
                if (angular.isDefined(item.userId)) {
                    $scope.checkboxes.items[item.userId] = value;
                }
            });

            if(value){
                selectedUserList=[];
                angular.forEach($scope.nonApprovedUsers, function (item) {
                    selectedUserList.push(item);
                });
            }else{
                selectedUserList=[];
            }

        });


        function _approveSelectedUsers(){

            if(selectedUserList.length>0){

                ($scope.userPromise = adminUserService.approveUsers(identityService.getAccessToken(),selectedUserList)).then(function(response){

                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                    init();
                }).catch(function(response){
                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.userPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _approveSelectedUsers();
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


