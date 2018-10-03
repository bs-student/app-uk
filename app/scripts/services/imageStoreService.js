(function () {

    'use strict';

    app
        .factory('imageStoreService', imageStoreService);

    imageStoreService.$inject=[];

    function imageStoreService() {

        var imageFiles=[];

        return {
            addImage: _addImage,
            storeImages : _storeImages,
            getStoredImages: _getStoredImages,
            removeStoredImage: _removeStoredImage,
            removeAllStoredImages :_removeAllStoredImages
        };

        function _addImage(image){
            imageFiles.push(image);
        }

        function _storeImages(files){
            imageFiles = files;
        }

        function _getStoredImages(){
            return imageFiles;
        }

        function _removeAllStoredImages(){
            imageFiles=[];
        }

        function _removeStoredImage(index){
            imageFiles.splice(index,1);
        }

    }

})();
