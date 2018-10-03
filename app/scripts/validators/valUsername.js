(function () {

    'use strict';

    app.directive("valUsername", valUsername);
    valUsername.$inject=['$q','$timeout','securityService'];
    function valUsername($q, $timeout, securityService) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function($scope, $element, $attrs, ctrl) {

                ctrl.$asyncValidators.valUsername = function(modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.when();
                    }

                    var def = $q.defer();

                    securityService.checkIfUsernameExist({'query':modelValue}).then(function(response){
                        if(response.data.success.usernameExist)def.reject();
                            else def.resolve();
                    });


                    return def.promise;
                };
            }
        };
    }

})();