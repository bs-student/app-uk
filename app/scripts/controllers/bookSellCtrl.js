(function () {

    'use strict';

    app
        .controller('BookSellCtrl', BookSellCtrl);

    BookSellCtrl.$inject = ['$state','$scope','bookService','identityService','responseService','$stateParams','imageModalService'];

    function BookSellCtrl($state,$scope,bookService,identityService,responseService,$stateParams,imageModalService) {


        if(!$scope.$parent.loggedIn){
            $state.go("app.login");
        }

        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "sellBook";

        if($stateParams.book==null){
            responseService.showErrorToast("No Book was found");
            $scope.book=[];
            $state.go("app.sellBook");
        }else{
            $scope.customBook=false;
            $scope.book = $stateParams.book;

            if($scope.book.campusLowestPrice!=undefined){
                $scope.foundCampusLowestPrice =true;
            }else{
                $scope.foundCampusLowestPrice =false;
            }
            $scope.book.contactInfoEmail =identityService.getAuthorizedUserData().email;
            $scope.amazonImageFile = {
                'fileData':$scope.book.bookImages[0].image
            };
        }


        $scope.nextStep=_nextStep;
        $scope.backToStep = _backToStep;

        if(identityService.getAuthorizedUserData()!=null){
            $scope.email=identityService.getAuthorizedUserData().email;
        }


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
        $scope.carouselFiles=[];

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;

        $scope.finalSubmit = _finalSubmit;








//        $scope.searchByIsbn = _searchByIsbn;
//        $scope.book = null;

//        $scope.addNewSellBook =false;
//        $scope.addCustomNewSellBook =false;
//        $scope.user = identityService.getAuthorizedUserData();
//        $scope.sellBook = _sellBook;
//        $scope.sellCustomBook = _sellCustomBook;
//        $scope.userDetails = identityService.getAuthorizedUserData();
        $scope.removeFile = _removeFile;
        $scope.viewImage = _viewImage;






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
                    $scope.availableDate = new Date($scope.book.availableDate);

                }
                else if(step=='step4'){
                    $scope.steps.step5=true;
                    $scope.step4Completed=true;

                    $scope.imageFiles=data;
//                    $scope.imageFiles=[];
                    angular.copy(data,$scope.carouselFiles);
//                    angular.copy(data,$scope.uploadFiles);
                    if($scope.carouselFiles.length==0){
                        $scope.carouselFiles.push($scope.amazonImageFile);
                    }else{
                        $scope.carouselFiles.unshift($scope.amazonImageFile);
                    }



                    setCarousel();
                    console.log($scope.carouselFiles);
                    console.log($scope.imageFiles);
                }

            }
        }

        function _backToStep(step){
            if(step=='Step1')$scope.steps.step1=true;
            else if(step=='Step2')$scope.steps.step2=true;
            else if(step=='Step3')$scope.steps.step3=true;
            else if(step=='Step4')$scope.steps.step4=true;
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
            $scope.carouselFiles[$scope.carouselFiles.indexOf(thumb)].active=true;
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
//                responseService.showSuccessToast("All Forms are correct. add the data to Database tomorrow and new custom books too. ")
                sellBook();
            }
        }


        function _viewImage(event, title) {
            imageModalService.showModal(event, title);
        }


        function _removeFile(item,items){

            var i = 0;
            angular.forEach(items,function(file){
                if(file.fileId == item.fileId){
                    items.splice(items.indexOf(file), 1);
                }
                i++;
            });
            $scope.imageFiles = items;

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
            bookData.bookDirectorAuthorArtist = $scope.book.bookDirectorAuthorArtist;
            bookData.bookEdition = $scope.book.bookEdition;
            bookData.bookIsbn10 = $scope.book.bookIsbn;
            bookData.bookIsbn13 = $scope.book.bookEan;
            bookData.bookPublisher = $scope.book.bookPublisher;
            bookData.bookPublishDate = $scope.book.bookPublishDate;
            bookData.bookBinding = $scope.book.bookBinding;
            bookData.bookPage = $scope.book.bookPages;
            bookData.bookLanguage = $scope.book.bookLanguage;
            bookData.bookDescription = $scope.book.bookDescription;
            bookData.bookAmazonPrice = $scope.book.bookPriceAmazon.substring(1,$scope.book.bookPriceAmazon.length);
            if(!$scope.customBook){
                bookData.bookImage = $scope.book.bookImages[0].image;
                bookData.bookType = "newSellBook";
            }
            /*if($scope.customBook){
                bookData.bookType = "newSellCustomBook";
            }*/




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
            bookDealData.bookPaymentMethodCaShOnExchange = $scope.book.paymentMethodCashOnExchange;
            bookDealData.bookPaymentMethodCheque = $scope.book.paymentMethodCheque;
            bookDealData.bookAvailableDate = $scope.book.availableDate;


            var data={
                bookData:bookData,
                bookDealData:bookDealData
            };


            formData.append("data",JSON.stringify(data));


            ($scope.bookSellPromise =  bookService.addSellBook(identityService.getAccessToken(),formData)).then(function(response){

                responseService.showSuccessToast(response.data.success.successTitle,response.data.success.successDescription);
                $state.go('app.sellingBookList');

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
