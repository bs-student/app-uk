(function () {

    'use strict';

    app
        .controller('BookBuyCtrl', BookBuyCtrl);

    BookBuyCtrl.$inject = ['$q','$log','$scope','universityService','responseService', 'identityService','$stateParams','$state','storageService','SERVER_CONSTANT'];

    function BookBuyCtrl($q,$log,$scope, universityService,responseService,identityService,$stateParams,$state,storageService,SERVER_CONSTANT) {


        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Buy Books";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "buyBook";

        $scope.searchingError = false;
        $scope.searchingProgress=true;
        $scope.searchBook = _searchBook;

        $scope.changePage = _changePage;

        $scope.bookSearchResult = null;

        $scope.maxSize = 10;
        $scope.totalSearchResults = 0;

        $scope.currentPage = 1;

        $scope.viewType = 'List';
        $scope.showResult = false;
        $scope.sortType = "bookTitle";
        $scope.selectedCampus={};

        init();

        function init(){
            $scope.searchUniversity = storageService.getValue("universityCampusDisplay");

            if($scope.searchUniversity==null){
                $scope.noUniversitySelected=true;
            }else{

                $scope.campus = {
                    display: storageService.getValue("universityCampusDisplay"),
                    value: storageService.getValue("universityCampusValue")
                }

                angular.copy($scope.campus,$scope.selectedCampus);
            }
            $scope.querySearch   = querySearch;
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
                    $scope.bookSearchForm.campus.$setValidity("data_error", true);
                    $scope.noUniversitySelected=false;
                    $scope.changeUniversity=false;
                    storageService.setValue('universityCampusDisplay',$scope.campus.display);
                    storageService.setValue('universityCampusValue',$scope.campus.value);
                    angular.copy($scope.campus,$scope.selectedCampus);
                }else{
                    console.log("SELECTED CAMPUS");
                    $scope.bookSearchForm.campus.$setValidity("data_error", false);

                }
            }
            function _onCampusChange(){
                if($scope.campus!=undefined){
                    if($scope.campus.value!=undefined){
                        $scope.bookSearchForm.campus.$setValidity("data_error", true);
                    }else{
                        $scope.bookSearchForm.campus.$setValidity("data_error", false);
                    }
                }else{
                    $scope.bookSearchForm.campus.$setValidity("data_error", false);
                }

            }


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


        }



        function _changePage(currentPage) {
            $scope.searchingError=false;
            var campus=null;
            if($scope.$parent.loggedIn){
                campus = identityService.getAuthorizedUserData().campusId;
            }else{
                campus= storageService.getValue("universityCampusValue");
            }
            $state.go('app.bookBuy.bookSearch',{searchQuery: $scope.searchText,pageNumber:currentPage,campus:campus});

        }

        function _searchBook(valid) {

            if (valid) {

                $scope.showResult = true;
                $scope.searchingError=false;
                var campus=null;
                if($scope.$parent.loggedIn){
                    campus = identityService.getAuthorizedUserData().campusId;
                }else{
                    campus= storageService.getValue("universityCampusValue");
                }

                $state.go('app.bookBuy.bookSearch',{searchQuery: $scope.searchText,pageNumber:1,campus:campus});

            }

        }



    }


})();


