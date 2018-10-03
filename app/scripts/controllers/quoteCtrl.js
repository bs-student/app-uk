(function () {

    'use strict';

    app
        .controller('QuoteCtrl', QuoteCtrl);

    QuoteCtrl.$inject = ['$state','identityService', 'adminQuoteService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT','imageModalService'];

    function QuoteCtrl($state,identityService, adminQuoteService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT,imageModalService) {


        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.$parent.main.title = "Quote";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.editRow=_editRow;
        $scope.cancelEditRow=_cancelEditRow;
        $scope.saveEditedRow = _saveEditedRow;

        $scope.showDeleteModal = _showDeleteModal;
        $scope.deleteQuote=_deleteQuote;

        $scope.studentQuotes=[];
        $scope.universityQuotes=[];

        init();

        function init(){
            getStudentQuotes();
            getUniversityQuotes();
        }
        function getStudentQuotes(){
            $scope.studentQuoteTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        quoteProvider: ''       // initial filter
                    },
                    sorting: {
                        quoteStatus: 'asc'     // initial sorting
                    }
                },

                {
                    total: $scope.studentQuotes.length, // length of data
                    getData: getStudentQuoteData
                });



            function getStudentQuoteData($defer, params) {

                var queryData =
                {
                    "searchQuery": params.filter().quoteProvider,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.quotePromise = adminQuoteService.getStudentQuotes(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.studentQuotes = response.data.success.successData.quotes.totalQuotes;
                    $scope.studentQuotes= $filter('orderBy')($scope.studentQuotes, params.orderBy());
                    $defer.resolve($scope.studentQuotes);
                    params.total(response.data.success.successData.quotes.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.quotePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getStudentQuoteData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }

        function getUniversityQuotes(){
            $scope.universityQuoteTableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        quoteProvider: ''       // initial filter
                    },
                    sorting: {
                        quoteStatus: 'asc'     // initial sorting
                    }
                },

                {
                    total: $scope.universityQuotes.length, // length of data
                    getData: getUniversityQuoteData
                });



            function getUniversityQuoteData($defer, params) {

                var queryData =
                {
                    "searchQuery": params.filter().quoteProvider,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.quotePromise = adminQuoteService.getUniversityQuotes(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.universityQuotes = response.data.success.successData.quotes.totalQuotes;
                    $scope.universityQuotes= $filter('orderBy')($scope.universityQuotes, params.orderBy());
                    $defer.resolve($scope.universityQuotes);
                    params.total(response.data.success.successData.quotes.totalNumber);

                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.quotePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getUniversityQuoteData($defer, params);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });
            }
        }




        function _editRow(row){
            row.$edit = true;
            row.quoteDescriptionOnEdit = row.quoteDescription ;
            row.quoteStatusOnEdit = row.quoteStatus;
            row.quoteProviderOnEdit = row.quoteProvider;
        }
        function _cancelEditRow(row){
            row.$edit = false;
            row.quoteDescription =  row.quoteDescriptionOnEdit;
            row.quoteStatus = row.quoteStatusOnEdit;
            row.quoteProvider = row.quoteProviderOnEdit;
        }

        function _saveEditedRow(valid,row){

            if(valid){
                row.$edit=false;

                ($scope.quotePromise = adminQuoteService.saveUpdatedQuote(identityService.getAccessToken(),row)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                }).catch(function (response) {
                    _cancelEditRow(row);

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.quotePromise = identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            _saveEditedRow(valid,row);
                        });
                    } else if (response.data.error != undefined) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                    } else {
                        responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                    }

                });

            }

        }

        function _showDeleteModal(event, modalTemplate,data){
            imageModalService.showPromptModal(event, modalTemplate,data,$scope);
        }

        function _deleteQuote(data){

            console.log(data.quote);
            var json={
                quoteId:data.quote.quoteId
            };
            ($scope.quotePromise=adminQuoteService.deleteQuote(identityService.getAccessToken(),json)).then(function(response){
                responseService.showSuccessToast(response.data.success.successTitle);

                if(data.quote.quoteType=="Student"){
                    $scope.studentQuotes.splice($scope.studentQuotes.indexOf(data.quote),1);
                }else{
                    $scope.universityQuotes.splice($scope.universityQuotes.indexOf(data.quote),1);
                }


            }).catch(function (response) {

                if (response.data.error_description == "The access token provided is invalid.") {

                } else if (response.data.error_description == "The access token provided has expired.") {
                    ($scope.quotePromise=identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                        identityService.setAccessToken(response.data);
                        _deleteQuote(data);
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


