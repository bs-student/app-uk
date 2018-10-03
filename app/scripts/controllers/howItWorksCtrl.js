(function () {

    'use strict';


    app
        .controller('HowItWorksCtrl', HowItWorksCtrl);

    HowItWorksCtrl.$inject = ['$scope','SERVER_CONSTANT'];

    function HowItWorksCtrl($scope,SERVER_CONSTANT) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "How It Works";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "howItWorks";


    }


})();
