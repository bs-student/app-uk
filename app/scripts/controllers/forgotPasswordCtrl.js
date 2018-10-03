(function () {
    'use strict';

    app
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);

    ForgotPasswordCtrl.$inject = ['$scope', 'securityService','responseService','$state'];

    function ForgotPasswordCtrl($scope, securityService,responseService,$state) {


        $scope.$parent.main.title = "Forgot Password";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "Forgot Password";

        $scope.forgotPassword = _forgotPassword;

        function _forgotPassword(valid) {

            if(valid){
                if ($scope.user != undefined) {
                    var userData = {'username':$scope.user.email,'key':$scope.user.key}
                       $scope.forgotPromise = securityService.forgotPassword(userData).then(function(response){
                        responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                           $state.go("app.dashboard");
                    }).catch(function(response){
                        responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
                    });
                }
            }


        }


    }

})();