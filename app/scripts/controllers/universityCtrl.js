(function () {

    'use strict';

    app
        .controller('UniversityCtrl', UniversityCtrl);

    UniversityCtrl.$inject = ['$state','$scope', 'referralService', 'countryService', 'identityService', 'stateService', 'universityService','responseService'];

    function UniversityCtrl($state,$scope, referralService, countryService, identityService, stateService, universityService,responseService) {


        $scope.$parent.main.title = "Add University";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "addUniversity";

        $scope.states=null;
        $scope.saveNewUniversity = _saveNewUniversity;
        $scope.addNewCampus = _addNewCampus;
        $scope.removeCampus = _removeCampus;
        $scope.fetchStates= _fetchStates;
        $scope.fetchStatesByCountry= _fetchStatesByCountry;


        referralService.getReferralList().then(function(response){
            $scope.referrals  = response.data.success.successData;
        }).catch(function(response){
            responseService.showErrorToast("Something Went Wrong","Please Reload Again");
        });
        countryService.getCountryList().then(function(response){
            $scope.countries  = response.data.success.successData;
        }).catch(function(response){
            responseService.showErrorToast("Something Went Wrong","Please Reload Again");
        });




        $scope.universities =
            [
                {
                    universityId: 0,
                    campuses:
                        [

                        ],
                    campusRemove : true

                }
            ];



        function _addNewCampus(university) {
            university.campuses.push({'campusId':university.campuses.length+1});
        }

        function _removeCampus(university,campus){
            for(var i in $scope.universities){
                if($scope.universities[i].universityId == university.universityId) {
                    for(var j in $scope.universities[i].campuses){
                        if($scope.universities[i].campuses[j].campusId == campus.campusId) {
                            $scope.universities[i].campuses.splice(j,1);

                        }
                    }
                }
            }
        }

        function _fetchStates(university,campus){

            var data = {'countryId':campus.country}
            stateService.getStateListByCountry(data).then(function(response){
                for(var i in $scope.universities){
                    if($scope.universities[i].universityId == university.universityId) {
                        for(var j in $scope.universities[i].campuses){
                            if($scope.universities[i].campuses[j].campusId == campus.campusId) {
                                $scope.universities[i].campuses[j].stateList = response.data.success.successData;
                            }
                        }
                    }
                }
            }).catch(function(response){
                responseService.showErrorToast("Something Went Wrong","Please Reload Again");
            });

        }

        function _fetchStatesByCountry(countryId){
            var data = {'countryId':countryId}
            stateService.getStateListByCountry(data).then(function(response){
                $scope.states = response.data.success.successData;
            }).catch(function(response){
                responseService.showErrorToast("Something Went Wrong","Please Reload Again");
            });
        }

        function _saveNewUniversity(valid){

            if(valid){

             var data =angular.copy($scope.universities[0]);

             data.campuses.unshift({
                 campusId:0,
                 campusName: $scope.universities[0].mainCampusName,
                 country: $scope.universities[0].mainCampusCountry,
                 state: $scope.universities[0].mainCampusState
             });


                if($scope.$parent.loggedIn){
                    data.access_token =identityService.getAccessToken();

                    universityService.saveNewUniversities(data).then(function(response){
                        responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                        $state.go("app.universityMap");
                    }).catch(function(response){

                        if (response.data.error_description == "The access token provided is invalid.") {

                        } else if (response.data.error_description == "The access token provided has expired.") {
                            (identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                                identityService.setAccessToken(response.data);
                                _saveNewUniversity(valid);
                            });
                        } else if (response.data.error != undefined) {
                            responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                        } else {
                            responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                        }

                    });

                }else{
                    universityService.saveNewUniversities(data).then(function(response){
                        responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                        $state.go("app.universityMap");
                    }).catch(function(response){
                        responseService.showErrorToast(response.data.error.errorTitle,response.data.error.errorDescription);
                    });
                }

            }

        }

    }


})();


