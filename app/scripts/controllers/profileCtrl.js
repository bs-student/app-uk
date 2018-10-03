(function () {

    'use strict';

    app
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$scope','$state', 'identityService', 'userService', 'responseService', 'universityService', '$log', '$q','SERVER_CONSTANT','storageService'];

    function ProfileCtrl($scope, $state,identityService, userService, responseService, universityService, $log, $q,SERVER_CONSTANT,storageService) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.files=[];
        $scope.updatingProfile=false;

        $scope.$parent.main.title = "Profile";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.editProfile = _editProfile;
        $scope.cancelEditProfile = _cancelEditProfile;
        $scope.updateProfile = _updateProfile;
        $scope.changeEmailNotification=_changeEmailNotification;

        $scope.querySearch = _querySearch;
        $scope.onCampusSelect = _onCampusSelect;
        $scope.onCampusChange = _onCampusChange;
        $scope.removeFile=_removeFile;


        $scope.modelOptions = {
            debounce: {
                default: 300,
                blur: 250
            },
            getterSetter: true
        };

        init();


        function init() {

            ($scope.profilePromise = userService.getAuthorizedUserFullData(identityService.getAccessToken())).then(function (response) {
                $scope.user = response.data.success.successData;
                if($scope.user.emailNotification=="On"){
                    $scope.emailNotification=true;
                }else{
                    $scope.emailNotification=false;
                }


            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.profilePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        init();
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }
            });

        }

        function _editProfile() {
            $scope.standardCellPhone = $scope.user.standardCellPhone;
            $scope.standardHomePhone = $scope.user.standardHomePhone;
            $scope.standardEmail = $scope.user.standardEmail;
            $scope.subject = {
                display: $scope.user.universityName+", "+$scope.user.campusName+", "+$scope.user.stateShortName+", "+$scope.user.countryName,
                value:$scope.user.campusId
            };
            $scope.fullName = $scope.user.fullName;
            $scope.updatingProfile = true;
        }

        function _cancelEditProfile() {
            $scope.standardCellPhone = $scope.user.standardCellPhone;
            $scope.standardHomePhone = $scope.user.standardHomePhone;
            $scope.standardEmail = $scope.user.standardEmail;
            $scope.subject = {
                display: $scope.user.universityName+", "+$scope.user.campusName+", "+$scope.user.stateShortName+", "+$scope.user.countryName,
                value:$scope.user.campsuId
            };
            $scope.fullName = $scope.user.fullName;
            $scope.updatingProfile = false;
        }


        function _onCampusSelect($item, $model, $label){
            if($scope.subject.value!=undefined){
                $scope.updateProfileForm.subject.$setValidity("data_error", true);
            }else{
                $scope.updateProfileForm.subject.$setValidity("data_error", false);
            }
        }
        function _onCampusChange(){
            if($scope.subject!=undefined){
                if($scope.subject.value!=undefined){
                    $scope.updateProfileForm.subject.$setValidity("data_error", true);
                }else{
                    $scope.updateProfileForm.subject.$setValidity("data_error", false);
                }
            }else{
                $scope.updateProfileForm.subject.$setValidity("data_error", false);
            }

        }
        
        function _querySearch(query) {

            var data = {'query': query, 'access_token': identityService.getAccessToken()};
            var deferred = $q.defer();
            universityService.getUniversitiesForAutocomplete(data).then(function (response) {
                deferred.resolve(response.data.success.successData);
            });
            return deferred.promise;

        }

        function _removeFile(item){

            console.log($scope);
            $scope.singleFile=false;
            var i = 0;
            angular.forEach($scope.files,function(file){
                if(file.fileId == item.fileId){
                    $scope.files.splice($scope.files.indexOf(file), 1);
                }
                i++;
            });
            console.log($scope.files);
        }
        function _updateProfile(valid) {


            if (valid) {

                var formData = new FormData();
                var i=0;
                angular.forEach($scope.files, function (file) {
                    formData.append("file"+ i.toString(),file);
                    i++;
                });

                var data = {};
                data.campus= $scope.subject.value;
                data.standardHomePhone=$scope.standardHomePhone;
                data.standardCellPhone=$scope.standardCellPhone;
                data.standardEmail=$scope.standardEmail;
                data.fullName=$scope.fullName;

                formData.append("profileData",JSON.stringify(data));


                $scope.profilePromise =  userService.updateUserProfile(identityService.getAccessToken(), formData).then(function (response) {
                    $scope.user.campusId = response.data.success.successData.campusId;
                    $scope.user.campusName = response.data.success.successData.campusName;
                    $scope.user.universityName = response.data.success.successData.universityName;
                    $scope.user.stateName = response.data.success.successData.stateName ;
                    $scope.user.stateShortName = response.data.success.successData.stateShortName  ;
                    $scope.user.fullName = response.data.success.successData.fullName;
                    $scope.user.standardHomePhone = response.data.success.successData.standardHomePhone;
                    $scope.user.standardCellPhone = response.data.success.successData.standardCellPhone;
                    $scope.user.standardEmail = response.data.success.successData.standardEmail;
                    $scope.user.profilePicture= response.data.success.successData.profilePicture;

                    $scope.updatingProfile=false;
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);



                    identityService.setAuthorizedUserData({
                        'campusDisplay':$scope.user.universityName+", "+$scope.user.stateName+", "+$scope.user.stateShortName+", "+response.data.success.successData.countryName,
                        'campusId':$scope.user.campusId,
                        'email':identityService.getAuthorizedUserData().email,
                        'fullName':$scope.user.fullName,
                        'profilePicture':$scope.user.profilePicture,
                        'registrationStatus':identityService.getAuthorizedUserData().registrationStatus,
                        'role':identityService.getAuthorizedUserData().role,
                        'universityName':$scope.user.universityName,
                        'username':identityService.getAuthorizedUserData().username
                    });

                    storageService.setValue('universityCampusDisplay',identityService.getAuthorizedUserData().campusDisplay);
                    storageService.setValue('universityCampusValue',identityService.getAuthorizedUserData().campusId);

                }).catch(function (response) {
                    if (response.data.error_description == "The access token provided is invalid.") {
                        $scope.user.fullName = $scope.fullNameOnEdit;
                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.profilePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _updateProfile(valid);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }
                });
            }
        }

        function _changeEmailNotification(emailNotification){

            var data=
            {
                "emailNotification":emailNotification?"On":"Off",
                "accessToken":identityService.getAccessToken()
            };

            $scope.profilePromise =  userService.updateUserEmailNotificationStatus(data).then(function (response) {

                $scope.emailNotification = emailNotification;
                $scope.user.emailNotification= response.data.success.successData.emailNotification;
                responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);


            }).catch(function (response) {
                if (response.data.error_description == "The access token provided is invalid.") {
                    $scope.emailNotification = !emailNotification;
                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.profilePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        _changeEmailNotification(emailNotification);
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    $scope.emailNotification = !emailNotification;
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    $scope.emailNotification = !emailNotification;
                }
            });
        }



    }


})();
