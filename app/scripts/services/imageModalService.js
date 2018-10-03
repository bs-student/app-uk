(function () {

    'use strict';

    app
        .factory('imageModalService', imageModalService);

    imageModalService.$inject=['$uibModal'];

    function imageModalService($uibModal) {


        return {
            showModal : _showModal,
            showPromptModal: _showPromptModal
        }

        function _showModal(event, title){
            var options = angular.element(event.target).data('options');
            var src = angular.element(event.target).attr('src');

            $uibModal.open({
                templateUrl: 'myModalContent',
                controller:'ModalInstanceCtrl',
                backdropClass: 'splash' + ' ' + options,
                windowClass: 'splash' + ' ' + options,
                resolve: {
                    src: function () {
                        return {src:src,title:title};
                    }
                }
            });
        }
        function _showPromptModal(event,modalTemplate,data,scope){
            var options = angular.element(event.target).data('options');

            $uibModal.open({
                templateUrl: modalTemplate,
                controller:'ModalInstanceCtrl',
                scope:scope,
                backdropClass: 'splash' + ' ' + options,
                windowClass: 'splash' + ' ' + options,
                resolve: {
                    src: function () {
                        return data;
                    }
                }
            });
        }

    }

})();
