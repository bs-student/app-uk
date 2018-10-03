(function () {

    'use strict';


    app
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$scope','$uibModalInstance','src'];

    function ModalInstanceCtrl($scope, $uibModalInstance, src) {

        $scope.src = src;
        $scope.closeModal = _closeModal;
        $scope.confirmModal = _confirmModal;

        function _closeModal() {
            $uibModalInstance.dismiss('cancel');
        }

        function _confirmModal(callBackFunction,data)  {
            callBackFunction(data);
            $uibModalInstance.close(data);
        }


    }


})();
