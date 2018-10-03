(function () {

    'use strict';

    app
        .factory('newsletterService', newsletterService);

    newsletterService.$inject=['apiService','SERVER_CONSTANT','NEWSLETTER_CONSTANT','ADMIN_CONSTANT'];

    function newsletterService(apiService,SERVER_CONSTANT,NEWSLETTER_CONSTANT,ADMIN_CONSTANT) {

        return {
            addNewsletterEmail:_addNewsletterEmail,
            adminGetAllNewsletterEmails:_adminGetAllNewsletterEmails,
            adminExportAllDataIntoCSV:_adminExportAllDataIntoCSV
        };


        function _addNewsletterEmail(data){
            return apiService.post(SERVER_CONSTANT.HOST+NEWSLETTER_CONSTANT.ADD_NEWSLETTER_EMAIL,data);
        }

        function _adminGetAllNewsletterEmails(accessToken,data){
            return apiService.post(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.GET_ALL_NEWSLETTER_EMAILS+"?access_token="+accessToken,data);
        }

        function _adminExportAllDataIntoCSV(accessToken){
            return apiService.get(SERVER_CONSTANT.HOST+ADMIN_CONSTANT.EXPORT_ALL_NEWSLETTER_DATA_INTO_CSV+"?access_token="+accessToken);
        }

    }

})();
