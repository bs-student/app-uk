/**
 * Created by Sujit on 8/19/16.
 */
(function () {

    'use strict';
    app.directive('valUsernameSpecialChar', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.valUsernameSpecialChar = function (modelValue, viewValue) {

                    var USERNAME_REGEXP = /^[a-zA-Z0-9_-]*$/;


                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }
                    console.log(modelValue);

                    if (USERNAME_REGEXP.test(modelValue)) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    });

})();