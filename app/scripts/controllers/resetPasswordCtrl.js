(function () {
    'use strict';

    app
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    ResetPasswordCtrl.$inject = ['$scope', '$state', 'securityService', '$stateParams', 'responseService'];

    function ResetPasswordCtrl($scope, $state, securityService, $stateParams, responseService) {

        $scope.$parent.main.title = "Reset Password";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "reset_password";

        $scope.resetLinkAlive = true;
        $scope.resetPassword = _resetPassword;
        $scope.token = $stateParams.code;

        ($scope.resetPromise = securityService.checkResetPasswordLink({'token': $scope.token})).then(function (response) {


        }).catch(function (response) {
            $scope.resetLinkAlive = false;
            if (response.data != undefined)
                responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
        });


        function _resetPassword(valid) {

            if (valid) {
                if ($scope.user != undefined) {

                    if ($scope.user.password == $scope.user.passwordConfirm) {

                        var data = {
                            'password': $scope.user.password,
                            'passwordConfirm': $scope.user.passwordConfirm,
                            'token': $scope.token
                        }
                            $scope.resetPromise = securityService.resetPassword(data).then(function (response) {

                            if (response.data.success != undefined) {
                                responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                                $state.go('app.login');
                            }

                        }).catch(function (response) {
                            responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                        });

                    }

                }
            }


        }


    }

})();