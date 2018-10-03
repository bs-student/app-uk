(function () {

    'use strict';

    app
        .controller('DisclaimerCtrl', DisclaimerCtrl);

    DisclaimerCtrl.$inject = ['$scope'];

    function DisclaimerCtrl($scope) {

        $scope.$parent.main.title = "Disclaimer";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

    }


})();


