(function () {

    'use strict';



    app
        .controller('DashboardCtrl', DashboardCtrl);


    DashboardCtrl.$inject = ['$scope', 'identityService', 'userService','$state','quoteService','SERVER_CONSTANT','storageService','$firebaseObject','$interval'];


    function DashboardCtrl($scope, identityService, userService,$state,quoteService,SERVER_CONSTANT,storageService,$firebaseObject,$interval) {

        $scope.$parent.main.title = "Textbook Exchange Made Easy";
        $scope.windowWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

        if($scope.windowWidth <992){
            $scope.$parent.headerStyle = "dark";
        }else{
            $scope.$parent.headerStyle = "light";
        }

        $scope.$parent.activePage = "home";
        $scope.firstSlide = true;
        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;
        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;

        $scope.showRegister = _showRegister;
        $scope.searchBook = _searchBook;
        $scope.peopleQuoteItems = [];
        $scope.universityQuoteItems = [];


        setUpPage();


        $scope.page = {
            title: 'Dashboard',
            subtitle: 'Student 2 Student HomePage'
        };

        function setUpPage(){
            quoteService.getActivatedStudentQuotes().then(function(response){
                $scope.peopleQuoteItems = response.data.success.successData;
            });
            quoteService.getActivatedUniversityQuotes().then(function(response){
                $scope.universityQuoteItems = response.data.success.successData;
            })
        }



        function _searchBook(valid){
            if(valid){
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

        function _showRegister(valid){
            if(valid){
                $state.go("app.signup",{email:$scope.email});
            }
        }

    }


})();
