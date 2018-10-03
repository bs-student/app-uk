(function () {

    'use strict';


    app
        .controller('SignupCtrl', SignupCtrl);

    SignupCtrl.$inject = ['$q','$log','$scope', 'identityService', '$state', "securityService", 'userService','referralService','universityService','responseService','$stateParams','$http'];

    function SignupCtrl($q,$log,$scope, identityService, $state, securityService, userService,referralService,universityService,responseService,$stateParams,$http) {

        $scope.$parent.main.title = "Join";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "signup";
        $scope.user=[];
        setUpForm();
        $scope.register=_register;
        $scope.createUniversityCampusName=false;

        $scope.peopleQuoteItems = [
            {id: 1, peopleName: 'John Douey', peopleType: 'Student', peopleImg: 'assets/images/avatars/random-avatar1.jpg', peopleQuote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitatio'},
            {id: 2, peopleName: 'John Douey', peopleType: 'Student', peopleImg: 'assets/images/avatars/random-avatar1.jpg', peopleQuote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitatio'},
            {id: 3, peopleName: 'John Douey', peopleType: 'Student', peopleImg: 'assets/images/avatars/random-avatar1.jpg', peopleQuote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitatio'}
        ];


        function setUpForm(){

            if($stateParams.email!=undefined){
                $scope.user.email=$stateParams.email;
            }

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


        function _register(valid){

            if(valid){


                var data =
                {
                    'fullName': $scope.user.fullName,
                    'username':$scope.user.username,
                    'email': $scope.user.email,
                    'referral':$scope.user.referral,
                    'new_password': $scope.user.password,
                    'confirm_password': $scope.user.passwordConfirm,
                    'key': $scope.user.key

                };
                if($scope.campus.value!=undefined){
                    $scope.userForm.campus.$setValidity("data_error", true);
                    data['campus']=$scope.campus.value;
                }else{
                    $scope.userForm.campus.$setValidity("data_error", false);
                }


                var json = JSON.stringify(data);

                ($scope.signupPromise = securityService.registerUser(data)).then(function (response){
                    if(response.data.success!=undefined){
                        responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                        $state.go('app.dashboard');
                    }

                }).catch(showError);
            }

        }

        function showError(response){

            var errorDescription="";
            if(response.data.error.errorData!=undefined){
                $scope.user.password=null;
                $scope.user.passwordConfirm=null;
                if(response.data.error.errorData.children.username.errors!=undefined){
                    errorDescription+= response.data.error.errorData.children.username.errors[0]+" ";
                }
                if(response.data.error.errorData.children.email.errors!=undefined){
                    errorDescription+= response.data.error.errorData.children.email.errors[0]+" ";
                }
            }

            responseService.showErrorToast(response.data.error.errorTitle,errorDescription+" "+response.data.error.errorDescription);
        }




    }


})();
