(function () {

    'use strict';

    app
        .factory('responseService', responseService);

    responseService.$inject=['toastr', 'toastrConfig'];

    function responseService(toastr, toastrConfig) {

        var openedToasts = [];
        var toast = {
            colors: [
                {name:'success'},
                {name:'error'}
            ]
        };
        var options = {
            position: 'toast-top-right',
            success_type: 'success',
            error_type: 'error',
            iconClass: toast.colors[0],
            timeout: '5000',
            extendedTimeout: '2000',
            html: false,
            closeButton: true,
            tapToDismiss: true,
            closeHtml: '<i class="fa fa-times"></i>'
        };

        return {
            clearLastToast : _clearLastToast,
            clearToasts : _clearToasts,
            showSuccessToast:_showSuccessToast,
            showErrorToast:_showErrorToast
        }


        function _clearLastToast(){
            var toast = openedToasts.pop();
            toastr.clear(toast);
        }

        function _clearToasts () {
            toastr.clear();
        }

        function _showSuccessToast(successTitle,successBody){
            var toast = toastr[options.success_type](successBody, successTitle, {
                iconClass: 'toast-success'+' ' + 'bg-success'
            });
            openedToasts.push(toast);
        }

        function _showErrorToast(errorTitle,errorBody){
            var toast = toastr[options.error_type](errorBody, errorTitle, {
                iconClass: 'toast-error'+' ' + 'bg-error'
            });
            openedToasts.push(toast);
        }

    }

})();
