(function () {

    'use strict';

    app
        .controller('NewsCtrl', NewsCtrl);

    NewsCtrl.$inject = ['$state','identityService', 'newsService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT','imageModalService','SOCIAL_MEDIA_CONSTANT','$location','$sce'];

    function NewsCtrl($state,identityService, newsService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT,imageModalService,SOCIAL_MEDIA_CONSTANT,$location,$sce) {



        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.$parent.main.title = "News";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "news";


        $scope.facebookLink = SOCIAL_MEDIA_CONSTANT.FACEBOOK_LINK;
        $scope.twitterLink = SOCIAL_MEDIA_CONSTANT.TWITTER_LINK;
        $scope.instagramLink = SOCIAL_MEDIA_CONSTANT.INSTAGRAM_LINK;

        $scope.shareLink = $location.absUrl();


        $scope.totalNews=[];
        $scope.firstNews=[];
        $scope.latestNews=[];
        init();

        function init(){
            getNewsData();

        }

        function getNewsData() {

            var queryData =
            {
                "searchQuery": "",
                "pageNumber": 1,
                "pageSize": 10,
                "sort":{
                    newsDateTime: 'desc'
                }
            };
            ($scope.newsPromise=newsService.getActivatedNews(queryData)).then(function (response) {

                $scope.totalNews = response.data.success.successData.news.totalNews;
                for(var i = 0;i<$scope.totalNews.length;i++){
                    $scope.totalNews[i].newsVideoEmbedCode = $sce.trustAsHtml($scope.totalNews[i].newsVideoEmbedCode);
                }
                $scope.latestNews = $scope.totalNews.slice(0,3);
                $scope.firstNews.push($scope.totalNews.shift());

            }).catch(function (response) {

                if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);

                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }


    }


})();


