(function () {

    'use strict';

    app
        .controller('ContactUsCtrl', ContactUsCtrl);

    ContactUsCtrl.$inject = ['$state', '$scope','responseService','contactUsService','SOCIAL_MEDIA_CONSTANT'];

    function ContactUsCtrl($state, $scope,responseService,contactUsService,SOCIAL_MEDIA_CONSTANT) {


        $scope.$parent.main.title = "Contact Us";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "helpAndSafety";
        $scope.facebookLink = SOCIAL_MEDIA_CONSTANT.FACEBOOK_LINK;
        $scope.twitterLink = SOCIAL_MEDIA_CONSTANT.TWITTER_LINK;
        $scope.instagramLink = SOCIAL_MEDIA_CONSTANT.INSTAGRAM_LINK;


        $scope.sendMessage=_sendMessage;

        function _sendMessage(valid){
            if(valid){
                var data={
                    "fullName": $scope.fullName,
                    "email": $scope.email,
                    "subject": $scope.subject,
                    "message": $scope.message,
                    "want": $scope.want,
                    "key": $scope.key
                };

                ($scope.contactUsPromise = contactUsService.sendContactUsMessage(data)).then(function(response){
                    responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                    $state.go('app.dashboard');
                }).catch(function (response){
                    responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
                });

            }
        }

    }


})();


