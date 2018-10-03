(function () {

    'use strict';

    app
        .controller('StartCtrl', StartCtrl)

    StartCtrl.$inject = ['$state', '$rootScope', '$scope', 'identityService', 'userService', 'securityService', 'responseService', 'storageService', 'newsletterService','$firebaseArray','$firebaseObject','eventService','SERVER_CONSTANT'];


    function StartCtrl($state, $rootScope, $scope, identityService, userService, securityService, responseService, storageService, newsletterService,$firebaseArray,$firebaseObject,eventService,SERVER_CONSTANT) {


        $scope.loggedIn = false;
        $scope.adminUser = false;

        $scope.notificationCounter=0;
        $scope.notifications=[];

        $scope.messageNotificationCounter=0;
        $scope.messageNotifications=[];

        $scope.logout = _logout;

        $scope.addToNewsletter = _addToNewsletter;
        $scope.user = [];
        $scope.imageHostPath = SERVER_CONSTANT.IMAGE_HOST_PATH;


        //Footer Carousel
        $scope.brandImages = [
            {
                brands: [
                    {image: "dist/images/footer/amazon_logo.png"},
                    {image: "dist/images/footer/Barners&Noble.png"},
                    {image: "dist/images/footer/Bigger_Books.png"},
                    {image: "dist/images/footer/chegg_logo.png"},
                    {image: "dist/images/footer/half_logo.png"},
                    {image: "dist/images/footer/Powells.png"}



                ]
            },
            {
                brands: [
                    {image: "dist/images/footer/abe_logo.png"},
                    {image: "dist/images/footer/tbl_logo.png"},
                    {image: "dist/images/footer/Textbook_Rush.png"},
                    {image: "dist/images/footer/Alibris.png"},
                    {image: "dist/images/footer/Knet_Books.png"},
                    {image: "dist/images/footer/EBooks.png"}

                ]
            },
            {
                brands: [
                    {image: "dist/images/footer/Phatcampus.png"},
                    {image: "dist/images/footer/Valore_Books.png"},
                    {image: "dist/images/footer/Biblio.png"},
                    {image: "dist/images/footer/Alibris.png"},
                    {image: "dist/images/footer/Barners&Noble.png"}

                ]
            }
        ];


        //Listen for getting New Messages
        eventService.on("getMessages",function(data,username){

            var ref = firebase.database().ref("/users/"+username+"/messages");

            $scope.messageList = $firebaseArray(ref);
            $scope.messageList.$watch(function(event) {

                var record = $scope.messageList.$getRecord(event.key);

                if(record!=null){
                    $scope.messageNotifications.push(record);
                    $scope.messageNotificationCounter +=1;
                    eventService.trigger("addNewMessage",record);
                }else{
                    $scope.messageNotificationCounter -=1;
                    angular.forEach($scope.messageNotifications,function(notification){
                        if(notification.$id==event.key){
                            $scope.messageNotifications.splice($scope.messageNotifications.indexOf(notification),1);
                        }
                    });
                }

            });

        });

        //Listen for removing message notification
        eventService.on("removeMessageNotification",function(data,messageData){

            var ref = firebase.database().ref("/users/"+messageData.username+"/messages");

            var list = $firebaseArray(ref);

            list.$loaded().then(function(notificationData){
                angular.forEach(notificationData,function(notification){
                    if(parseInt(notification.messageId,10)==parseInt(messageData.message.messageId,10)){
                        list.$remove(notificationData.indexOf(notification));
                    }
                });
            });

        });


        //Listen for getting view Number
        eventService.on("getViewNumbers",function(){

            var ref = firebase.database().ref("/views");

            $scope.viewList = $firebaseArray(ref);
            $scope.viewList.$watch(function(event) {

                var record = $scope.viewList.$getRecord(event.key);
                if(record!=null){
                    eventService.trigger("addNewViewNumber",record);
                }
                $scope.viewList.$loaded().then(function(viewData){
                    $scope.viewList.$remove(viewData.$indexFor(event.key));
                });

            });

        });






        //Listen for getting contact notification
        eventService.on("getContactNotifications",function(data,username){

            var ref = firebase.database().ref("/users/"+username+"/contacts");

            $scope.notificationList = $firebaseArray(ref);
            $scope.notificationList.$watch(function(event) {
                var record = $scope.notificationList.$getRecord(event.key);
                if(record!=null){
                    $scope.notifications.push(record);
                    $scope.notificationCounter +=1;

                    eventService.trigger("addNewContactNumber",record);

                }else{
                    $scope.notificationCounter -=1;
                    angular.forEach($scope.notifications,function(notification){
                        if(notification.$id==event.key){
                            $scope.notifications.splice($scope.notifications.indexOf(notification),1);
                        }
                    });
                }

            });

        });


        //Listen for removing contact notification
        eventService.on("removeContactNotification",function(data,contactData){

            var ref = firebase.database().ref("/users/"+contactData.username+"/contacts");

            var list = $firebaseArray(ref);

            list.$loaded().then(function(notificationData){
                angular.forEach(notificationData,function(notification){
                    if(notification.contactId==contactData.contact.contactId){
                        list.$remove(notificationData.indexOf(notification));
                    }
                });
            });

        });







        checkIfUserLoggedIn();

        function checkIfUserLoggedIn() {
            if (identityService.getAuthorizedUserData() == null) {
                userService.getAuthorizedUserShortData(identityService.getAccessToken()).then(setUserData).catch(checkProblem);
            } else {
                if (identityService.getAuthorizedUserData().registrationStatus == "incomplete") {
                    $state.go('registration.complete');
                }
                identityService.setAuthorizedUserData(identityService.getAuthorizedUserData());
                userLoggedIn(identityService.getAuthorizedUserData());
                 /*else if (identityService.getAuthorizedUserData().registrationStatus == "complete") {
                    $state.go('app.dashboard');
                }*/

            }
        }

        function setUserData(response) {
//            storageService.setValue("universityCampusValue",response.data.success.successData.campusId);
            identityService.setAuthorizedUserData(response.data.success.successData);
            if (identityService.getAuthorizedUserData().registrationStatus == "incomplete") {
                userLoggedIn(response.data.success.successData);
                $state.go('registration.complete');
            } else if (identityService.getAuthorizedUserData().registrationStatus == "complete") {
                userLoggedIn(response.data.success.successData);
//                $state.go('app.dashboard');
            }

        }

        function checkProblem(response) {
            if(response.data!=undefined){
                console.log(response.data.error_description);
                if (response.data.error_description == "The access token provided has expired.") {
                    identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(setAccessToken);
                }
            }

        }

        function setAccessToken(response) {
            identityService.setAccessToken(response.data);
            checkIfUserLoggedIn();
        }


        function userLoggedIn(userData) {

            if (userData.role.indexOf("ROLE_ADMIN_USER") >= 0) {
                $scope.adminUser = true;
            } else {
                $scope.adminUser = false;
            }
            $scope.loggedIn = true;
            $scope.username = identityService.getAuthorizedUserData().username;
            $scope.profilePicture = identityService.getAuthorizedUserData().profilePicture;

            storageService.setValue('universityCampusDisplay',identityService.getAuthorizedUserData().campusDisplay);
            storageService.setValue('universityCampusValue',identityService.getAuthorizedUserData().campusId);

            eventService.trigger("getContactNotifications",$scope.username);
            eventService.trigger("getViewNumbers");
            eventService.trigger("getMessages",$scope.username);


        }


        function _logout() {
            securityService.logoutUser().then(function (response) {
                if (response.data.success.successTitle = "Homepage") {
                    var username = identityService.getAuthorizedUserData().username;
                    identityService.clearAccessToken();
                    identityService.clearAuthorizedUserData();
                    $scope.username = "Loading...";
                    $scope.loggedIn = false;
                    responseService.showSuccessToast("Goodbye "+username,"You are logged out.");

                    if($scope.notificationList!=undefined){
                        $scope.notificationList.$destroy();
                        $scope.viewList.$destroy();
                        $scope.messageList.$destroy();
                        $scope.notificationCounter=0;
                        $scope.notifications=[];
                    }


                    $state.go("app.dashboard");

                }
            }).catch(function (response) {
                responseService.showErrorToast("Could not Log Out", "Sorry, Try again.");
            });
        }

        function _addToNewsletter(valid) {
                    ($scope.newsletterPromise = newsletterService.addNewsletterEmail({email:$scope.user.newsLetterEmail})).then(function (response) {
                        responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                        $scope.user.newsLetterEmail = "";
                    }).catch(function (response) {
                        responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);


                    });

        }



    }


})();
