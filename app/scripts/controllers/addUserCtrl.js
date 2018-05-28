(function () {
    'use strict';

    app
        .controller('AddUserCtrl', AddUserCtrl);

    AddUserCtrl.$inject = ['identityService', 'adminUserService', 'responseService', '$scope', '$state'];

    function AddUserCtrl(identityService, adminUserService, responseService, $scope, $state) {


        $scope.$parent.main.title = "Add Users";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";


        $scope.addUser = _addUser;


        function _addUser(valid) {
            if(valid){
                var userData = {
                    email:$scope.user.email,
                    fullName:$scope.user.fullName,
                    adminApproved:"Yes",
                    adminVerified:"Yes",
                    emailVerified:"Yes",
                    username:$scope.user.username,
                    new_password: $scope.user.password,
                    confirm_password: $scope.user.passwordConfirm
                };

                ($scope.$parent.userPromise = adminUserService.addAdminUser(identityService.getAccessToken(),userData)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                    $scope.$parent.adminUsers.push(response.data.success.successData);
                    $state.go('app.userList');

                }).catch(function(response){

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.$parent.userPromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _addUser(valid);
                        });
                    } else if (response.data.error != undefined) {
                        var errorDescription="";
                        if(response.data.error.errorData!=undefined){
                            $scope.user.password=null;
                            $scope.user.passwordConfirm=null;
                            if(response.data.error.errorData.children.username.errors!=undefined){
                                errorDescription+= response.data.error.errorData.children.username.errors[0]+". ";
                            }
                            if(response.data.error.errorData.children.email.errors!=undefined){
                                errorDescription+= response.data.error.errorData.children.email.errors[0]+". ";
                            }
                        }

                        responseService.showErrorToast(response.data.error.errorTitle, errorDescription+". "+response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });


            }

        }
    }

})();