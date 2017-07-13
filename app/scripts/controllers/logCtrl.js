(function () {

    'use strict';

    app
        .controller('LogCtrl', LogCtrl);

    LogCtrl.$inject = ['$state','identityService', 'adminUserService', '$scope', '$filter', '$q', 'ngTableParams','responseService','adminLogService'];

    function LogCtrl($state,identityService, adminUserService, $scope, $filter, $q, ngTableParams,responseService,adminLogService) {


        $scope.$parent.main.title = "User Log";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";


        $scope.logs=[];


        $scope.logTypes = [
            {
                'title':"Registration",
                'id':"Registration"
            },
            {
                'title':"Login",
                'id':"Login"
            },
            {
                'title':"Change Password",
                'id':"Change Password"
            },
            {
                'title':"Email Notification Change",
                'id':"Email Notification Change"
            },
            {
                'title':"Profile Update",
                'id':"Profile Update"
            },
            {
                'title':"Promote Sell Page",
                'id':"Promote Sell Page"
            },
            {
                'title':"Add Book",
                'id':"Add Book"
            },
            {
                'title':"Add Book Deal",
                'id':"Add Book Deal"
            },
            {
                'title':"Update Book Deal",
                'id':"Update Book Deal"
            },
            {
                'title':"Delete Book Deal",
                'id':"Delete Book Deal"
            },
            {
                'title':"Sold Book",
                'id':"Sold Book"
            },
            {
                'title':"Buyer Contacted",
                'id':"Buyer Contacted"
            },
            {
                'title':"Approve User",
                'id':"Approve User"
            },
            {
                'title':"Update User",
                'id':"Update User"
            },
            {
                'title':"Add Admin User",
                'id':"Add Admin User"
            },
            {
                'title':"Add University",
                'id':"Add University"
            },
            {
                'title':"Approve University",
                'id':"Approve University"
            },
            {
                'title':"Update University",
                'id':"Update University"
            },
            {
                'title':"Merge University",
                'id':"Merge University"
            },
            {
                'title':"Add News",
                'id':"Add News"
            },
            {
                'title':"Update News",
                'id':"Update News"
            },
            {
                'title':"Add Quote",
                'id':"Add Quote"
            },
            {
                'title':"Update Quote",
                'id':"Update Quote"
            },
            {
                'title':"Delete Quote",
                'id':"Delete Quote"
            },
            {
                'title':"Newsletter Export",
                'id':"Newsletter Export"
            }
        ];

        $scope.logUserTypes = [
            {
                'title':"Normal User",
                'id':"Normal User"
            },
            {
                'title':"Admin User",
                'id':"Admin User"
            }
        ];

        init();

        function init(){
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        username: '',
                        logType: '',
                        logUserType: ''
                    },
                    sorting: {
                        logDateTime: 'desc'// initial sorting
                    }
                },

                {
                    total: $scope.logs.length, // length of data
                    getData: getData
                });



            function getData($defer, params) {

                var queryData =
                {
                    "usernameQuery": params.filter().username,
                    "logTypeQuery": params.filter().logType,
                    "logUserTypeQuery": params.filter().logUserType,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.logPromise = adminLogService.getLog(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.logs = response.data.success.successData.logs.totalLogs;
                    $defer.resolve($scope.logs);
                    params.total(response.data.success.successData.logs.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {
//                        $scope.$parent.logout();
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.logPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
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




    }


})();


