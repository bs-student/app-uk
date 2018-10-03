(function () {

    'use strict';

    app
        .factory('loginService', loginService);

    loginService.$inject=['$scope', 'identityService', 'userService','securityService'];

    function loginService($scope,identityService, userService,securityService) {


    }

})();
