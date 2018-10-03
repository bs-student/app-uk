(function () {

    'use strict';


    app
        .controller('SignupConfirmCtrl', SignupConfirmCtrl);

    SignupConfirmCtrl.$inject = ['$state','$stateParams','securityService','responseService'];

    function SignupConfirmCtrl($state,$stateParams,securityService,responseService) {

        securityService.confirmRegistration($stateParams.code).then(function(response){

            responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
            $state.go('app.login');

        }).catch(function(response){
            responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
        });



    }


})();
