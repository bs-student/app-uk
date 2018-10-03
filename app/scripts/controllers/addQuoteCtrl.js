(function () {
    'use strict';

    app
        .controller('AddQuoteCtrl', AddQuoteCtrl);

    AddQuoteCtrl.$inject = ['identityService', 'adminQuoteService', 'responseService', '$scope', '$state'];

    function AddQuoteCtrl(identityService, adminQuoteService, responseService, $scope, $state) {

        $scope.$parent.main.title = "Add Quotes";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.removeFile=_removeFile;
        $scope.addQuote = _addQuote;


        function _addQuote(valid,quoteType) {

            if(valid){
                var formData = new FormData();
                var i=0;
                angular.forEach($scope.files, function (file) {
                    formData.append("file"+ i.toString(),file);
                    i++;
                });
                var quote={};
                quote.quoteType = quoteType;
                quote.quoteDescription = $scope.quote.quoteDescription;
                quote.quoteProvider = $scope.quote.quoteProvider;

                formData.append("quote",JSON.stringify(quote));

                ($scope.$parent.quotePromise = adminQuoteService.addQuote(identityService.getAccessToken(),formData)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                    if(quoteType=="Student"){
                        $scope.$parent.studentQuotes.push(response.data.success.successData);
                    }else if(quoteType=="University"){
                        $scope.$parent.universityQuotes.push(response.data.success.successData);
                    }

                    $state.go('app.quotes');

                }).catch(function(response){

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.$parent.quotePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _addQuote(valid,quoteType);
                        });
                    } else if (response.data.error != undefined) {

                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });


            }

        }

        function _removeFile(item){

            console.log($scope);
            $scope.singleFile=false;
            var i = 0;
            angular.forEach($scope.files,function(file){
                if(file.fileId == item.fileId){
                    $scope.files.splice($scope.files.indexOf(file), 1);
                }
                i++;
            });
            console.log($scope.files);
        }
    }

})();