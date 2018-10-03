(function () {

    'use strict';

    app
        .controller('UniversityEditCtrl', UniversityEditCtrl);

    UniversityEditCtrl.$inject = ['$stateParams', 'identityService', 'adminUniversityService', '$scope', 'responseService', 'countryService', 'stateService','$state'];

    function UniversityEditCtrl($stateParams, identityService, adminUniversityService, $scope, responseService, countryService, stateService,$state) {

        $scope.$parent.main.title = "Edit University";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.fetchStates = _fetchStates;
        $scope.addNewCampus = _addNewCampus;
        $scope.removeCampus = _removeCampus;
        $scope.saveEditedUniversity = _saveEditedUniversity;

        $scope.universities = [];

        $scope.universities.push($stateParams.university);
        $scope.universities[0].newCampuses=[];

        //Initialize country & state dropdowns regarding campus data
        countryService.getCountryList().then(function (response) {
            $scope.countries = response.data.success.successData;

            for (var i = 0; i < $scope.universities[0].campuses.length; i++) {
                angular.forEach($scope.countries, function (country) {
                    if ($scope.universities[0].campuses[i].countryName == country.countryName) {
                        $scope.universities[0].campuses[i].country = country.id;
                        _fetchStates($scope.universities[0], $scope.universities[0].campuses[i]);

                    }
                });
            }
        }).catch(function (response) {
            responseService.showErrorToast("Something Went Wrong", "Please Reload Again");
        });


        function _fetchStates(university, campus) {
            var data = {'countryId': campus.country}
            stateService.getStateListByCountry(data).then(function (response) {
                for (var i in $scope.universities) {
                    if ($scope.universities[i].universityId == university.universityId) {
                        for (var j in $scope.universities[i].campuses) {
                            if ($scope.universities[i].campuses[j].campusId == campus.campusId) {
                                $scope.universities[i].campuses[j].stateList = response.data.success.successData;
                            }
                        }
                        for (var k in $scope.universities[i].newCampuses) {
                            if ($scope.universities[i].newCampuses[k].campusId == campus.campusId) {
                                $scope.universities[i].newCampuses[k].stateList = response.data.success.successData;
                            }
                        }
                    }
                }

                for (var i = 0; i < $scope.universities[0].campuses.length; i++) {
                    angular.forEach($scope.universities[0].campuses[i].stateList, function (state) {
                        if ($scope.universities[0].campuses[i].stateName == state.stateName) {
                            $scope.universities[0].campuses[i].state = state.id;
                        }
                    });
                }



            }).catch(function (response) {
                responseService.showErrorToast("Something Went Wrong", "Please Reload Again");
            });

        }

        function _addNewCampus(university) {
            university.newCampuses.push({'campusId':Math.floor((Math.random() * 10000) + 1)});
        }

        function _removeCampus(university,campus){
            for(var i in $scope.universities){
                if($scope.universities[i].universityId == university.universityId) {
                    for(var j in $scope.universities[i].newCampuses){
                        if($scope.universities[i].newCampuses[j].campusId == campus.campusId) {
                            $scope.universities[i].newCampuses.splice(j,1);

                        }
                    }
                }
            }
        }

        function _saveEditedUniversity(valid){

            if(valid){

                var data =angular.copy($scope.universities[0]);


                data.access_token =identityService.getAccessToken();

                ($scope.universityPromise = adminUniversityService.updateUniversityDetails(data)).then(function(response){
                    responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                    $state.go("app.universityManagement");
                }).catch(function(response){

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        (identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _saveEditedUniversity(valid);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });



            }

        }

    }


})();


