(function () {

    'use strict';


    app
        .controller('ConceptVideoSpanishCtrl', ConceptVideoSpanishCtrl);

    ConceptVideoSpanishCtrl.$inject = ['$scope','SERVER_CONSTANT'];

    function ConceptVideoSpanishCtrl($scope,SERVER_CONSTANT) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Concept Video Spanish";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "howItWorks";


    }


})();
