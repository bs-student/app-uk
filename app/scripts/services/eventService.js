(function () {

    'use strict';

    app
        .service('eventService', eventService);

    eventService.$inject=['$rootScope'];

    function eventService($rootScope) {
        this.trigger = function (name, args) {
            $rootScope.$broadcast(name, args);
        };

        this.on = function (name, handler) {
            $rootScope.$on(name, handler);
        };

    }

})();
