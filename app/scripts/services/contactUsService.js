(function () {

    'use strict';

    app
        .factory('contactUsService', contactUsService);

    contactUsService.$inject=['SERVER_CONSTANT','CONTACT_US_CONSTANT','apiService'];

    function contactUsService(SERVER_CONSTANT,CONTACT_US_CONSTANT,apiService) {

        return {
            sendContactUsMessage:_sendContactUsMessage,
            sendMailsToFriends:_sendMailsToFriends
        };


        function _sendContactUsMessage(data){
            return apiService.post(SERVER_CONSTANT.HOST+CONTACT_US_CONSTANT.SEND_CONTACT_MESSAGE,data);
        }

        function _sendMailsToFriends(data){
            return apiService.post(SERVER_CONSTANT.HOST+CONTACT_US_CONSTANT.SEND_MAILS_TO_FRIENDS,data);
        }

    }

})();
