(function () {

    'use strict';


    app
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$stateParams','$scope', 'identityService', '$state', "securityService", 'userService','responseService','wishListService','$auth','quoteService','SERVER_CONSTANT','eventService','$firebaseObject','$firebaseArray','storageService'];

    function LoginCtrl($stateParams,$scope, identityService, $state, securityService, userService,responseService,wishListService,$auth,quoteService,SERVER_CONSTANT,eventService,$firebaseObject,$firebaseArray,storageService) {

        $scope.$parent.main.title = "Sign In";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "login";

        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.peopleQuoteItems = [];
        ($scope.quotePromise = quoteService.getActivatedStudentQuotes()).then(function(response){
            $scope.peopleQuoteItems = response.data.success.successData;
        });


        $scope.bookId = $stateParams.bookId;
        $scope.loginUser = _loginUser;


        $scope.loginSocial = _loginSocial;



        function _loginSocial(provider){
            $auth.authenticate(provider).then(function(response){
                if(response.data.success.successTitle!=undefined || response.data.success.successDescription!=undefined){
                    responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription)
                }
                if(response.data.success.successData.registrationStatus!=undefined){
                    if(response.data.success.successData.registrationStatus=="incomplete"){
                        $state.go("app.completeRegistration",{user:response.data.success.successData})
                    }else{
                        identityService.getSocialPluginAccessToken(response.data.success.successData.serviceId).then(getAuthorizedUserData).catch(showUnknownError);
                    }
                }

            }).catch(function(response){
                responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
            });
        }



        function _loginUser(valid) {
            if(valid){
               var  data={
                    _username: $scope.user._username,
                    _password: $scope.user._password
                };
                ($scope.loginPromise = securityService.loginUser(data)).then(showDashboardPage).catch(showLoginUnsuccessful);
            }
        }



        function showLoginUnsuccessful(response){
            responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
        }
        function showUnknownError(){
            responseService.showErrorToast("Login Unsuccessful","Sorry, we couldn't log you in. Please Try again");
        }

        function showDashboardPage(response) {
            if(response.data.success){
                if(response.data.success.successData){
                    if(response.data.success.successData.registrationStatus==="complete"){
                        ($scope.loginPromise = identityService.getInitialAccessToken($scope.user)).then(getAuthorizedUserData).catch(showUnknownError);
                    }
                }
            }
        }

        function getAuthorizedUserData(response) {

            identityService.setAccessToken(response.data);

            ($scope.loginPromise = userService.getAuthorizedUserShortData(response.data.access_token)).then(setAuthorizedUserData).catch(function(response){
                if (response.data.error_description == "The access token provided is invalid.") {
                    $scope.$parent.logout();
                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(setAuthorizedUserData).catch(function(){
                        responseService.showErrorToast("Something Went Wrong", "Please try again.");
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }
            });


        }

        function setAuthorizedUserData(response) {
            identityService.setAuthorizedUserData(response.data.success.successData);

            storageService.setValue('universityCampusDisplay',identityService.getAuthorizedUserData().campusDisplay);
            storageService.setValue('universityCampusValue',identityService.getAuthorizedUserData().campusId);


            responseService.showSuccessToast("Hey, welcome "+identityService.getAuthorizedUserData().username,"You are logged in.");

            //Listen To Real Time Time Notification
            eventService.trigger("getContactNotifications",response.data.success.successData.username);
            eventService.trigger("getViewNumbers");
            eventService.trigger("getMessages",response.data.success.successData.username);

            if(response.data.success.successData.role.indexOf("ROLE_ADMIN_USER")>=0){
                $scope.$parent.adminUser=true;
            }else{
                $scope.$parent.adminUser=false;
            }
            $scope.$parent.loggedIn = true;
            $scope.$parent.username = response.data.success.successData.username;
            $scope.$parent.profilePicture = response.data.success.successData.profilePicture;

            if($scope.bookId!=undefined){
                wishListService.addBookToWishList(identityService.getAccessToken(),{bookId:$scope.bookId}).then(function(response){
                    responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                }).catch(function(response){
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                });
            }

            $scope.user._username="";
            $scope.user._password="";
            $state.go('app.dashboard');

        }






    }


})();
