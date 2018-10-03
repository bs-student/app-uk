(function () {

    'use strict';

    app
        .factory('storageService', storageService);

    storageService.$inject=[];

    function storageService() {

        return {
            getValue: _getValue,
            setValue: _setValue

        };

        function _getValue(valueName){
            return localStorage.getItem(valueName);
        }

        function _setValue(valueName,valueData){
            localStorage[valueName] = valueData;
        }


    }

})();
