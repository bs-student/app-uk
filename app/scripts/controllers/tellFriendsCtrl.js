(function () {

    'use strict';

    app
        .controller('TellFriendsCtrl', TellFriendsCtrl);

    TellFriendsCtrl.$inject = ['$state', '$scope','responseService','contactUsService','identityService','SERVER_CONSTANT'];

    function TellFriendsCtrl($state, $scope,responseService,contactUsService,identityService,SERVER_CONSTANT) {


        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Tell a Friend";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "howItWorks";

        $scope.user=[];
        if($scope.$parent.loggedIn){
            $scope.shareUrl = window.location.origin+"/"+identityService.getAuthorizedUserData().username;
            $scope.shareText = identityService.getAuthorizedUserData().username+"'s Sell Page | Student2Student.co.uk | Textbook Exchange made Easy";
            $scope.shareHashtags = identityService.getAuthorizedUserData().username+"_Sell_Page, Student2Student, Textbook_Exchange_made_Easy";

            $scope.user.email = identityService.getAuthorizedUserData().email;
            $scope.user.fullName = identityService.getAuthorizedUserData().fullName;

        }else{
            $scope.shareUrl = "http://www.student2student.co.uk/";
            $scope.shareText = "Student2Student.co.uk Textbook Exchange made Easy";
            $scope.shareHashtags = "Student2Student, Textbook_Exchange_made_Easy";
        }


        $scope.addNewFriendEmail = _addNewFriendEmail;
        $scope.removeFriendEmail = _removeFriendEmail ;
        $scope.sendMails=_sendMails;

        $scope.friendEmails =
            [
                {
                    email:" ",
                    remove : false
                }
            ];

        function _addNewFriendEmail() {
            $scope.friendEmails.push({
                email:" ",
                remove : true
            });
        }
        function _removeFriendEmail (email){
            console.log($scope.friendEmails.indexOf(email));
            $scope.friendEmails.splice($scope.friendEmails.indexOf(email),1);
        }

        function _sendMails(valid){
            if(valid){
                var data={
                    "fullName": $scope.user.fullName,
                    "email": $scope.user.email,
                    "message": $scope.user.message,
                    "key": $scope.user.key,
                    "friendEmails": $scope.friendEmails,
                    "token":identityService.getAccessToken()
                };

                if($scope.$parent.loggedIn){
                    ($scope.contactUsPromise = contactUsService.sendMailsToUserFriends(data)).then(function(response){
                        responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                        $state.go('app.dashboard');
                    }).catch(function (response){
                        responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
                    });
                }else{
                    ($scope.contactUsPromise = contactUsService.sendMailsToFriends(data)).then(function(response){
                        responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                        $state.go('app.dashboard');
                    }).catch(function (response){
                        responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
                    });
                }

            }
        }

    }


})();


