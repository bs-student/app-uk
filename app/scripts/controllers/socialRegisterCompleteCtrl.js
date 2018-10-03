(function () {

    'use strict';


    app
        .controller('SocialRegisterCompleteCtrl', SocialRegisterCompleteCtrl);

    SocialRegisterCompleteCtrl.$inject = ['$stateParams',"$state","$scope", '$q', '$log', 'universityService','identityService','userService','referralService','responseService','securityService','wishListService','eventService'];

    function SocialRegisterCompleteCtrl($stateParams,$state,$scope, $q, $log, universityService,identityService,userService,referralService,responseService,securityService,wishListService,eventService) {

        $scope.user = $stateParams.user;

        $scope.$parent.main.title = "Join";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "signup";

        if($scope.user==undefined){
            $state.go('app.login');
        }

        $scope.completeRegistration = _completeRegistration;


        setUpForm();


        function setUpForm(){

            referralService.getReferralList().then(function(response){
                $scope.referrals = response.data.success.successData;
            }).catch(function(response){
                responseService.showErrorToast("Something Went Wrong","Please Reload Again");
            });

            $scope.states        = null;
            $scope.querySearch   = _querySearch;
            $scope.onCampusSelect = _onCampusSelect;
            $scope.onCampusChange = _onCampusChange;



            $scope.modelOptions = {
                debounce: {
                    default: 300,
                    blur: 250
                },
                getterSetter: true
            };
            function _onCampusSelect($item, $model, $label){
                if($scope.campus.value!=undefined){
                    $scope.userForm.campus.$setValidity("data_error", true);
                }else{
                    $scope.userForm.campus.$setValidity("data_error", false);
                }
            }
            function _onCampusChange(){
                if($scope.campus!=undefined){
                    if($scope.campus.value!=undefined){
                        $scope.userForm.campus.$setValidity("data_error", true);
                    }else{
                        $scope.userForm.campus.$setValidity("data_error", false);
                    }
                }else{
                    $scope.userForm.campus.$setValidity("data_error", false);
                }

            }
            function _querySearch (query) {

                var data ={'query':query};
                return universityService.getUniversitiesForAutocomplete(data).then(function(response){
                    return response.data.success.successData.map(function(item){
                        return item;
                    });
                }).catch(function(response){
                    responseService.showErrorToast("Something Went Wrong","Please Reload Again");
                });
            }

        }

        function _completeRegistration(valid){

            if(valid){

                if($scope.campus.value!=undefined){
                    $scope.userForm.campus.$setValidity("data_error", true);
                    $scope.user.campus = $scope.campus.value;
                }else{
                    $scope.userForm.campus.$setValidity("data_error", false);
                }

                var data =
                {
                    'user':$scope.user
                };
                var json = JSON.stringify(data);
                $scope.socialRegistrationPromise = (securityService.updateSocialUser(json)).then(function (response){

                    identityService.getSocialPluginAccessToken(response.data.success.successData.serviceId).then(getAuthorizedUserData).catch(showUnknownError);

                }).catch(function(response){
                    responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
                });



            }

        }

        function getAuthorizedUserData(response) {

            identityService.setAccessToken(response.data);

            $scope.socialRegistrationPromise = (userService.getAuthorizedUserShortData(response.data.access_token)).then(setAuthorizedUserData).catch(function(response){
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
            responseService.showSuccessToast("Login Successful");

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
            $state.go('app.dashboard');

        }
        function showUnknownError(){
            responseService.showErrorToast("Login Unsuccessful","Sorry, we couldn't log you in. Please Try again");
        }



    }


})();


