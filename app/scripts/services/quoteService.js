(function () {

    'use strict';

    app
        .factory('quoteService', quoteService);

    quoteService.$inject=['apiService','SERVER_CONSTANT','QUOTE_CONSTANT'];

    function quoteService(apiService,SERVER_CONSTANT,QUOTE_CONSTANT) {

        return {
            getActivatedStudentQuotes:_getActivatedStudentQuotes,
            getActivatedUniversityQuotes:_getActivatedUniversityQuotes

        };


        function _getActivatedStudentQuotes(){
            return apiService.get(SERVER_CONSTANT.HOST+QUOTE_CONSTANT.GET_ACTIVATED_STUDENT_QUOTE);
        }
        function _getActivatedUniversityQuotes(){
            return apiService.get(SERVER_CONSTANT.HOST+QUOTE_CONSTANT.GET_ACTIVATED_UNIVERSITY_QUOTE);
        }


    }

})();
