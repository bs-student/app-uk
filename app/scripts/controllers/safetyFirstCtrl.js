(function () {

    'use strict';

    app
        .controller('SafetyFirstCtrl', SafetyFirstCtrl);

    SafetyFirstCtrl.$inject = ['$scope','SERVER_CONSTANT'];

    function SafetyFirstCtrl($scope,SERVER_CONSTANT) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Safety First";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "helpAndSafety";



    }


})();


