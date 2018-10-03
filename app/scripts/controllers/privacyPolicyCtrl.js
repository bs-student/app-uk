(function () {

    'use strict';

    app
        .controller('PrivacyPolicyCtrl', PrivacyPolicyCtrl);

    PrivacyPolicyCtrl.$inject = ['$scope'];

    function PrivacyPolicyCtrl($scope) {

        $scope.$parent.main.title = "Privacy Policy";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";


    }


})();


