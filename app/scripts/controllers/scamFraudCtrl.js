(function () {

    'use strict';

    app
        .controller('ScamFraudCtrl', ScamFraudCtrl);

    ScamFraudCtrl.$inject = ['$scope','SERVER_CONSTANT'];

    function ScamFraudCtrl($scope,SERVER_CONSTANT) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Scam & Fraud";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "helpAndSafety";



    }


})();


