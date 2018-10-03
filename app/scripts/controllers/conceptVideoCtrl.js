(function () {

    'use strict';


    app
        .controller('ConceptVideoCtrl', ConceptVideoCtrl);

    ConceptVideoCtrl.$inject = ['$scope','SERVER_CONSTANT'];

    function ConceptVideoCtrl($scope,SERVER_CONSTANT) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Concept Video";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "howItWorks";


    }


})();
