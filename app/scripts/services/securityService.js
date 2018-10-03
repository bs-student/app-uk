(function () {

    'use strict';

    app
        .factory('securityService', securityService);

    securityService.$inject = [ 'apiService', 'SERVER_CONSTANT', 'LOGIN_CONSTANT', 'SECURITY_CONSTANT'];

    function securityService( apiService, SERVER_CONSTANT, LOGIN_CONSTANT, SECURITY_CONSTANT) {


        return {
            loginUser: _loginUser,
            logoutUser: _logoutUser,
            registerUser:_registerUser,
            confirmRegistration:_confirmRegistration,
            checkIfUsernameExist: _checkIfUsernameExist,
            checkIfEmailExist:_checkIfEmailExist,
            forgotPassword: _forgotPassword,
            resetPassword: _resetPassword,
            checkResetPasswordLink: _checkResetPasswordLink,
            updateSocialUser:_updateSocialUser

        };


        function _loginUser(data) {
            return apiService.post(SERVER_CONSTANT.HOST + LOGIN_CONSTANT.SUBMIT, data);
        }

        function _logoutUser() {
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.LOGOUT);
        }


        function _registerUser(data){
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.REGISTER, data);
        }

        function _checkIfUsernameExist(query){
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.CHECK_IF_USERNAME_EXIST, query);
        }

        function _checkIfEmailExist(query){
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.CHECK_IF_EMAIL_EXIST, query);
        }

        function _confirmRegistration(code){
            return apiService.get(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.CONFIRM_REGISTRATION+"/"+code);
        }
        function _forgotPassword(email){
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.FORGOT_PASSWORD, email);
        }

        function _checkResetPasswordLink(data){
            return apiService.get(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.CHECK_RESET_PASSWORD_LINK+"/"+data.token);
        }

        function _resetPassword(data){
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.RESET_PASSWORD+"/"+data.token,data);
        }


        function _updateSocialUser(data) {
            return apiService.post(SERVER_CONSTANT.HOST + SECURITY_CONSTANT.UPDATE_SOCIAL_USER,data);
        }




    }


})();
