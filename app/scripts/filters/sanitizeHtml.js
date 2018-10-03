(function () {

    'use strict';

    app
        .filter('sanitizeHtml', sanitizeHtml);

    sanitizeHtml.$inject=['$sce'];

    function sanitizeHtml($sce) {

        return function (html){
            return $sce.trustAsHtml(html);
        };

    }

})();
