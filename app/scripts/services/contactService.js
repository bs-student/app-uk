(function () {

    'use strict';

    app
        .factory('contactService', contactService);

    contactService.$inject=['SERVER_CONSTANT','CONTACT_CONSTANT','apiService'];

    function contactService(SERVER_CONSTANT,CONTACT_CONSTANT,apiService) {

        return {
            addContact:_addContact,
            getMessages:_getMessages,
            sendMessages:_sendMessages,

            sendMessagesWithoutMailing:_sendMessagesWithoutMailing

        };


        function _addContact(data){
            if(data.access_token!=null){
                return apiService.post(SERVER_CONSTANT.HOST+CONTACT_CONSTANT.ADD_CONTACT_API+"?access_token="+data.access_token,data);
            }else{
                return apiService.post(SERVER_CONSTANT.HOST+CONTACT_CONSTANT.ADD_CONTACT,data);
            }

        }

        function _getMessages(data){
            return apiService.post(SERVER_CONSTANT.HOST+CONTACT_CONSTANT.GET_MESSAGES+"?access_token="+data.accessToken,data);
        }

        function _sendMessages(data){
            return apiService.post(SERVER_CONSTANT.HOST+CONTACT_CONSTANT.SEND_MESSAGES+"?access_token="+data.accessToken,data);
        }

        function _sendMessagesWithoutMailing(data){
            return apiService.post(SERVER_CONSTANT.HOST+CONTACT_CONSTANT.SEND_MESSAGES_WITHOUT_MAILING+"?access_token="+data.accessToken,data);
        }

    }

})();
