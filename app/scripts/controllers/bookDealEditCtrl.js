(function () {

    'use strict';

    app
        .controller('BookDealEditCtrl', BookDealEditCtrl);

    BookDealEditCtrl.$inject = ['$stateParams','$state','identityService', 'adminUserService', '$scope', '$filter', '$q', 'ngTableParams','responseService','adminBookDealService','SERVER_CONSTANT','imageModalService','bookDealService','imageStoreService'];

    function BookDealEditCtrl($stateParams,$state,identityService, adminUserService, $scope, $filter, $q, ngTableParams,responseService,adminBookDealService,SERVER_CONSTANT,imageModalService,bookDealService,imageStoreService) {


        if($stateParams.book!=undefined){
            $scope.book = $stateParams.book;
            $scope.book.contactInfoEmail =$scope.book.sellerEmail;
            $scope.book.contactInfoHomePhone =$scope.book.sellerHomeNumber;
            $scope.book.contactInfoCellPhone =$scope.book.sellerCellNumber;
            $scope.email = $scope.book.sellerEmail;
            $scope.book.bookAvailableDate = new Date($scope.book.bookAvailableDate);
            $scope.bookPriceSell = $scope.book.bookPriceSell;
            $scope.universityName =identityService.getAuthorizedUserData().universityName;
            getLowestCampusDealPrice();



        }else{
            $state.go("app.sellingBookList");
        }

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Book Deal Edit";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";
        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;



        $scope.nextStep=_nextStep;
        $scope.backToStep = _backToStep;

        $scope.previewSelected = _previewSelected;

        //DatePicker

        $scope.today = function() {
            $scope.book.bookAvailableDate = new Date();
        };
        $scope.clear = function() {
            $scope.book.bookAvailableDate = null;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            'class': 'datepicker'
        };
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.book.bookAvailableDate = new Date(year, month, day);
        };
        $scope.format = 'dd-MMMM-yyyy';
        $scope.popup1 = {
            opened: false
        };

        $scope.imageFiles=[];
        $scope.carouselFiles=[];

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;

        $scope.removeBookImageFile = _removeBookImageFile;
        $scope.removeFile = _removeFile;
        $scope.viewImage = _viewImage;

        $scope.finalSubmit = _finalSubmit;


        function _nextStep(valid,step,data){

            if(valid){

                if(step=='step1'){
                    $scope.steps.step2=true;
                    $scope.step1Completed=true;
                }
                else if(step=='step2'){
                    $scope.steps.step3=true;
                    $scope.step2Completed=true;
                }
                else if(step=='step3'){
                    $scope.steps.step4=true;
                    $scope.step3Completed=true;
                }
                else if(step=='step4'){
                    $scope.steps.step5=true;
                    $scope.step4Completed=true;


                }

            }
        }

        function _backToStep(step){
            if(step=='Step1')$scope.steps.step1=true;
            else if(step=='Step2')$scope.steps.step2=true;
            else if(step=='Step3')$scope.steps.step3=true;
            else if(step=='Step4')$scope.steps.step4=true;
        }


        function _previewSelected(){

            $scope.steps.step5=true;
            $scope.step4Completed=true;

            $scope.carouselFiles=[];


            angular.forEach($scope.book.bookImages,function(image){
                image.fileData=$scope.imageHostPath+image.image;
                $scope.carouselFiles.push(image);

            });

            angular.forEach(imageStoreService.getStoredImages(),function(image){
                $scope.carouselFiles.push(image);
            });

            setCarousel();
        }

        // Set Carousel
        function setCarousel() {

            $scope.thumbnailSize = 3;
            $scope.thumbnailPage = 1;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;

            if ($scope.carouselFiles.length == 1) {
                $scope.showThumb = false;
            } else {
                $scope.showThumb = true;
            }
            $scope.showThumbnails = $scope.carouselFiles.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

        }

        function _prevPage() {
            if ($scope.thumbnailPage > 1) {
                $scope.thumbnailPage--;
            }
            $scope.showThumbnails = $scope.carouselFiles.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);
        }

        function _nextPage() {
            if ($scope.thumbnailPage <= Math.floor($scope.carouselFiles.length / $scope.thumbnailSize)) {
                $scope.thumbnailPage++;
            }
            $scope.showThumbnails = $scope.carouselFiles.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);
        }

        function _setActive(thumb) {
            angular.forEach($scope.carouselFiles,function(item){
                item.active=false;
            });
            $scope.carouselFiles[$scope.carouselFiles.indexOf(thumb)].active=true;
        }

        function _viewImage(event, title) {
            imageModalService.showModal(event, title);
        }


        function _removeBookImageFile(file){
            $scope.book.bookImages.splice($scope.book.bookImages.indexOf(file),1);
        }
        function _removeFile(item,items){

            imageStoreService.removeStoredImage(imageStoreService.getStoredImages().indexOf(item));

            var i = 0;
            angular.forEach(items,function(file){
                if(file.fileId == item.fileId){
                    items.splice(items.indexOf(file), 1);
                }
                i++;
            });

        }

        function getLowestCampusDealPrice(){

            bookDealService.getLowestCampusDealPrice(identityService.getAccessToken(),{"bookIsbn":$scope.book.bookIsbn}).then(function(response){
                if(response.data.success.successData.lowestCampusPrice!=undefined){
                    $scope.campusLowestPrice=response.data.success.successData.lowestCampusPrice;
                    $scope.foundCampusLowestPrice=true;
                }

            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        getLowestCampusDealPrice();
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }

        function _finalSubmit(step1Valid,step2Valid,step3Valid,step5Valid){

            var error =false;

            if(!step1Valid){
                responseService.showErrorToast("Please Fill Up Book Information Form Correctly.");
                error=true;
            }else if(!step2Valid){
                responseService.showErrorToast("Please Fill Up Contact Method Form Correctly.");
                error=true;
            }else if(!step3Valid){
                responseService.showErrorToast("Please Fill Up Deal TErms Form Correctly.");
                error=true;
            }else if(!step5Valid){
                error=true;
            }

            if(!error){
                sellBook();
            }
        }


        function sellBook(){

            var formData = new FormData();

            var i=0;
            angular.forEach(imageStoreService.getStoredImages(), function (file) {

                formData.append("file"+ i.toString(),file);

                i++;
            });


            $scope.book.bookContactHomeNumber = $scope.book.contactInfoHomePhone;
            $scope.book.bookContactCellNumber = $scope.book.contactInfoCellPhone;
            $scope.book.bookContactEmail = $scope.book.contactInfoEmail;


            var data={
                bookDealData:$scope.book
            };

            formData.append("data",JSON.stringify(data));


            ($scope.bookSellPromise =  bookDealService.updateBookDeal(identityService.getAccessToken(),formData)).then(function(response){

                responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                $state.go('app.sellingBookList');

            }).catch(function(response){
                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        sellBook()
                    });
                } else if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }
            });

        }

    }


})();


