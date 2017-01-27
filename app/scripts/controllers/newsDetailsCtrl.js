(function () {

    'use strict';

    app
        .controller('NewsDetailsCtrl', NewsDetailsCtrl);

    NewsDetailsCtrl.$inject = ['$stateParams','$state','identityService', 'newsService', '$scope', '$filter', '$q', 'ngTableParams','responseService','SERVER_CONSTANT','imageModalService','SOCIAL_MEDIA_CONSTANT','$location','$sce'];

    function NewsDetailsCtrl($stateParams,$state,identityService, newsService, $scope, $filter, $q, ngTableParams,responseService,SERVER_CONSTANT,imageModalService,SOCIAL_MEDIA_CONSTANT,$location,$sce) {



        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;

        $scope.$parent.main.title = "News Details";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "news";

        $scope.facebookLink = SOCIAL_MEDIA_CONSTANT.FACEBOOK_LINK;
        $scope.twitterLink = SOCIAL_MEDIA_CONSTANT.TWITTER_LINK;
        $scope.instagramLink = SOCIAL_MEDIA_CONSTANT.INSTAGRAM_LINK;

        $scope.shareLink = $location.absUrl();

        if($stateParams.newsId==undefined){
            $state.go('app.news');
        }else{
            $scope.firstNews=[];
            $scope.latestNews=[];
            $scope.alsoLikedNews=[];
            getSingleNews($stateParams.newsId);
            getLatest10News();
        }



        function getSingleNews(newsId){
            ($scope.newsPromise=newsService.getSingleNews({"newsId":newsId})).then(function (response) {
                response.data.success.successData.news.newsVideoEmbedCode = $sce.trustAsHtml(response.data.success.successData.news.newsVideoEmbedCode);
                $scope.firstNews.push(response.data.success.successData.news);

            }).catch(function (response) {

                if (response.data.error != undefined) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                } else {
                    responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                }

            });
        }

        function getLatest10News(){
            var queryData =
            {
                "searchQuery": "",
                "pageNumber": 1,
                "pageSize": 10,
                "sort":{
                    newsDateTime: 'desc'
                }
            };
            newsService.getActivatedNews(queryData).then(function (response) {

                var allNews= response.data.success.successData.news.totalNews;
                console.log(allNews);
                for(var i = 0;i<allNews.length;i++){
                    allNews[i].newsVideoEmbedCode = $sce.trustAsHtml(allNews[i].newsVideoEmbedCode);
                }
                $scope.alsoLikedNews = allNews.slice(0,2);
                $scope.latestNews = allNews.slice(2,5);

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


