(function () {

    'use strict';

    app
        .controller('UniversityMapCtrl', UniversityMapCtrl);

    UniversityMapCtrl.$inject = ['$q','$log','$scope',  'universityService','responseService','campusService'];

    function UniversityMapCtrl($q,$log,$scope, universityService,responseService,campusService) {


        $scope.$parent.main.title = "University Map";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "universityMap";


        $scope.campusDetails=null;
        $scope.querySearch   = querySearch;

        $scope.onCampusSelect = _onCampusSelect;

        $scope.modelOptions = {
            debounce: {
                default: 300,
                blur: 250
            },
            getterSetter: true
        };


        function querySearch (query) {

            var data ={'query':query};
            return universityService.getUniversitiesForAutocomplete(data).then(function(response){
                return response.data.success.successData.map(function(item){
                    return item;
                });
            }).catch(function(response){
                responseService.showErrorToast("Something Went Wrong","Please Reload Again");
            });

        }


        function _onCampusSelect($item, $model, $label){
            if($scope.campus.value!=undefined){
                campusService.getCampusDetailsWithUniversityAndState({campusId:$scope.campus.value}).then(function(response){
                    $scope.campusDetails = response.data.success.successData[0];
                }).catch(function(response){
                    responseService.showErrorToast("Sorry Something Went Wrong","Please Search again");
                });
            }
        }



    }


})();


