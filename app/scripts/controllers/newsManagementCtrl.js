(function () {

    'use strict';

    app
        .controller('NewsManagementCtrl', NewsManagementCtrl);

    NewsManagementCtrl.$inject = ['$state','identityService', 'adminNewsService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT','imageModalService','$sce'];

    function NewsManagementCtrl($state,identityService, adminNewsService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT,imageModalService,$sce) {

        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.$parent.main.title = "News Management";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.editRow=_editRow;
        $scope.cancelEditRow=_cancelEditRow;
        $scope.saveEditedRow = _saveEditedRow;


        $scope.totalNews=[];

        $scope.prevPage = _prevPage;
        $scope.nextPage = _nextPage;
        $scope.setActive = _setActive;

        $scope.viewImage = _viewImage;


        init();

        function init(){
            getNews();

        }

        function setCarousel() {

            $scope.thumbnailSize = 3;
            $scope.thumbnailPage = 1;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;

            angular.forEach($scope.totalNews, function (news) {

                if (news.newsImages.length == 1) {
                    news.showThumb = false;
                } else {
                    news.showThumb = true;
                }

                news.showThumbnails = news.newsImages.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

            });

        }

        function _prevPage(news) {
            if ($scope.thumbnailPage > 1) {
                $scope.thumbnailPage--;
            }
            news.showThumbnails = news.newsImages.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

        }

        function _nextPage(news) {

            if ($scope.thumbnailPage <= Math.floor(news.newsImages.length / $scope.thumbnailSize)) {
                $scope.thumbnailPage++;
            }
            news.showThumbnails = news.newsImages.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

        }

        function _setActive(news, idx) {

            angular.forEach(news.showThumbnails, function (slide) {


                if (slide.imageId == idx) {
                    slide.active = true;
                }
                else {
                    slide.active = false;
                }

            });
        }


        // Set View Image
        function _viewImage(event, title) {
            imageModalService.showModal(event, title);
        }

        function getNews(){
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,            // show first page
                    count: 10,           // count per page
                    filter: {
                        newsTitle: ''       // initial filter
                    },
                    sorting: {
                        newsDateTime: 'desc'     // initial sorting
                    }
                },

                {
                    total: $scope.totalNews.length, // length of data
                    getData: getNewsData
                });



            function getNewsData($defer, params) {

                var queryData =
                {
                    "searchQuery": params.filter().newsTitle,
                    "pageNumber": params.page(),
                    "pageSize": params.count(),
                    "sort":params.sorting()
                };
                ($scope.newsPromise= adminNewsService.getNews(identityService.getAccessToken(), queryData)).then(function (response) {
                    $scope.totalNews = response.data.success.successData.news.totalNews;

                    for(var i = 0;i<$scope.totalNews.length;i++){
                        $scope.totalNews[i].newsVideoEmbedCode = $sce.trustAsHtml($scope.totalNews[i].newsVideoEmbedCode);
                    }

                    $scope.totalNews= $filter('orderBy')($scope.totalNews, params.orderBy());
                    $defer.resolve($scope.totalNews);
                    params.total(response.data.success.successData.news.totalNumber);
                    setCarousel();
                }).catch(function (response) {

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.newsPromise= identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
                            identityService.setAccessToken(response.data);
                            getNewsData($defer, params);
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
            row.newsDescriptionOnEdit = row.newsDescription ;
            row.newsStatusOnEdit = row.newsStatus;
            row.newsTitleOnEdit = row.newsTitle;
        }
        function _cancelEditRow(row){
            row.$edit = false;
            row.newsDescription =  row.newsDescriptionOnEdit;
            row.newsStatus = row.newsStatusOnEdit;
            row.newsTitle = row.newsTitleOnEdit;
        }

        function _saveEditedRow(valid,row){

            if(valid){
                row.$edit=false;

                ($scope.newsPromise= adminNewsService.saveUpdatedNews(identityService.getAccessToken(),row)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                }).catch(function (response) {
                    _cancelEditRow(row);

                    if (response.data.error_description == "The access token provided is invalid.") {

                    } else if (response.data.error_description == "The access token provided has expired.") {
                        ($scope.newsPromise= identityService.getRefreshAccessToken(identityService.getRefreshToken())).then(function (response) {
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
    }


})();


