(function () {

    'use strict';

    app
        .factory('newsService', newsService);

    newsService.$inject=['apiService','SERVER_CONSTANT','NEWS_CONSTANT'];

    function newsService(apiService,SERVER_CONSTANT,NEWS_CONSTANT) {

        return {
            getActivatedNews:_getActivatedNews,
            getSingleNews:_getSingleNews
        };


        function _getActivatedNews(data){
            return apiService.post(SERVER_CONSTANT.HOST+NEWS_CONSTANT.GET_ACTIVATED_NEWS,data);
        }
        function _getSingleNews(data){
            return apiService.post(SERVER_CONSTANT.HOST+NEWS_CONSTANT.GET_SINGLE_NEWS,data);
        }

    }

})();
