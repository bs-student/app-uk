(function () {

    'use strict';

    app
        .controller('BookSellCustomCtrl', BookSellCustomCtrl);

    BookSellCustomCtrl.$inject = ['$state','$scope','bookService','identityService','responseService','$stateParams','imageModalService','imageStoreService','SERVER_CONSTANT'];

    function BookSellCustomCtrl($state,$scope,bookService,identityService,responseService,$stateParams,imageModalService,imageStoreService,SERVER_CONSTANT) {


        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "Sell Books";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "sellBook";

        $scope.book=[];

        $scope.universityName =identityService.getAuthorizedUserData().universityName;
        if(identityService.getAuthorizedUserData().standardEmail!=undefined){
            $scope.book.contactInfoEmail =identityService.getAuthorizedUserData().standardEmail;
            $scope.email =identityService.getAuthorizedUserData().standardEmail;
        }else{
            $scope.book.contactInfoEmail =identityService.getAuthorizedUserData().email;
            $scope.email =identityService.getAuthorizedUserData().email;
        }

        $scope.book.contactInfoHomePhone =identityService.getAuthorizedUserData().standardHomePhone;
        $scope.book.contactInfoCellPhone =identityService.getAuthorizedUserData().standardCellPhone;



        $scope.nextStep=_nextStep;
        $scope.backToStep = _backToStep;

        $scope.previewSelected = _previewSelected;

        //DatePicker

        $scope.today = function() {
            $scope.book.availableDate = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.book.availableDate = null;
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
            $scope.book.availableDate = new Date(year, month, day);
        };
        $scope.format = 'dd-MMMM-yyyy';
        $scope.popup1 = {
            opened: false
        };

        $scope.imageFiles=[];
        $scope.noImages=true;

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;

        $scope.finalSubmit = _finalSubmit;

        $scope.removeFile = _removeFile;
        $scope.viewImage = _viewImage;






        function _nextStep(valid,step){


            if(valid){

                if(step=='step1'){
                    $scope.steps.step2=true;
                    $scope.step1Completed=true;
                    $scope.publishDate = new Date($scope.book.bookPublishDate);
                }
                else if(step=='step2'){
                    $scope.steps.step3=true;
                    $scope.step2Completed=true;
                }
                else if(step=='step3'){
                    $scope.steps.step4=true;
                    $scope.step3Completed=true;
                    $scope.availableDate = new Date($scope.book.availableDate);

                }
                else if(step=='step4'){

                    if(imageStoreService.getStoredImages().length==0){
                        $scope.noImages=true;
                    }else{
                        $scope.noImages=false;
                        $scope.steps.step5=true;
                        $scope.step4Completed=true;

                    }

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

            $scope.imageFiles=imageStoreService.getStoredImages();

            if($scope.imageFiles.length==0){
                $scope.noImages=true;
            }else{
                $scope.noImages=false;
                $scope.steps.step5=true;
                $scope.step4Completed=true;


            }
            setCarousel();

        }


        // Set Carousel
        function setCarousel() {

            $scope.thumbnailSize = 3;
            $scope.thumbnailPage = 1;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;

            if ($scope.imageFiles.length == 1 || $scope.imageFiles.length == 0) {
                $scope.showThumb = false;
            } else {
                $scope.showThumb = true;
            }
            $scope.showThumbnails = $scope.imageFiles.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

        }

        function _prevPage() {
            if ($scope.thumbnailPage > 1) {
                $scope.thumbnailPage--;
            }
            $scope.showThumbnails = $scope.imageFiles.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);
        }

        function _nextPage() {
            if ($scope.thumbnailPage <= Math.floor($scope.imageFiles.length / $scope.thumbnailSize)) {
                $scope.thumbnailPage++;
            }
            $scope.showThumbnails = $scope.imageFiles.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);
        }

        function _setActive(thumb) {
            angular.forEach($scope.imageFiles,function(item){
                item.active=false;
            });
            $scope.imageFiles[$scope.imageFiles.indexOf(thumb)].active=true;
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

            if($scope.noImages){
                responseService.showErrorToast("Please Add at least One Image.");
                error=true;
            }

            if(!error){
                sellBook();
            }
        }


        function _viewImage(event, title) {
            imageModalService.showModal(event, title);
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


            if(imageStoreService.getStoredImages().length==0){
                $scope.noImages=true;
            }
        }

        function sellBook(){



            var formData = new FormData();


            var i=0;
            angular.forEach($scope.imageFiles, function (file) {

                formData.append("file"+ i.toString(),file);

                i++;
            });


            console.log(formData);
            var bookData={};

            bookData.bookTitle = $scope.book.bookTitle;
            bookData.bookSubTitle = $scope.book.bookSubTitle;
            bookData.bookDirectorAuthorArtist = $scope.book.bookDirectorAuthorArtist;
            bookData.bookEdition = $scope.book.bookEdition;
            bookData.bookIsbn10 = $scope.book.bookIsbn10;
            bookData.bookIsbn13 = $scope.book.bookIsbn13;
            bookData.bookPublisher = $scope.book.bookPublisher;
            bookData.bookPublishDate = $scope.book.bookPublishDate;
            bookData.bookBinding = $scope.book.bookBinding;
            bookData.bookPage = $scope.book.bookPages;
            bookData.bookLanguage = $scope.book.bookLanguage;
            bookData.bookDescription = $scope.book.bookDescription;

            bookData.bookType = "newSellCustomBook";

            var bookDealData={};

            bookDealData.bookPriceSell = $scope.book.sellingPrice;
            bookDealData.bookCondition = $scope.book.bookCondition;
            bookDealData.bookIsHighlighted = $scope.book.textHighlighted;
            bookDealData.bookHasNotes = $scope.book.notesOnTextbook;
            bookDealData.bookComment = $scope.book.comment;
            bookDealData.bookContactMethod = $scope.book.contactMethod;
            bookDealData.bookContactHomeNumber = $scope.book.contactInfoHomePhone;
            bookDealData.bookContactCellNumber = $scope.book.contactInfoCellPhone;
            bookDealData.bookContactEmail = $scope.book.contactInfoEmail;
            bookDealData.bookIsAvailablePublic = $scope.book.availablePublic;
            bookDealData.bookPaymentMethodCashOnExchange = $scope.book.paymentMethodCashOnExchange;
            bookDealData.bookPaymentMethodCheque = $scope.book.paymentMethodCheque;
            bookDealData.bookAvailableDate = $scope.book.availableDate;


            var data={
                bookData:bookData,
                bookDealData:bookDealData
            };


            formData.append("data",JSON.stringify(data));


            ($scope.bookSellPromise =bookService.addSellBook(identityService.getAccessToken(),formData)).then(function(response){

                responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
//                $state.go('app.sellingBookList');
                $state.go('app.tellFriends');

            }).catch(function(response){
                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                        identityService.setAccessToken(response.data);
                        _sellBook(valid);
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
