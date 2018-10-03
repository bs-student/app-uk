(function () {

    'use strict';
    app.directive("valEmail",valEmail);

    valEmail.$inject=['$q','$timeout','securityService'];

    function valEmail ($q, $timeout, securityService) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function($scope, $element, $attrs, ctrl) {

                ctrl.$asyncValidators.valEmail = function(modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.when();
                    }

                    var def = $q.defer();

                    securityService.checkIfEmailExist({'query':modelValue}).then(function(response){
                        if(response.data.success.emailExist)def.reject();
                            else def.resolve();
                    });


                    return def.promise;
                };
            }
        };
    }

})();