(function () {

    'use strict';

    app
        .controller('ContactCtrl', ContactCtrl);

    ContactCtrl.$inject = ['$scope', '$stateParams', '$state', 'identityService', 'contactService', 'responseService', '$firebaseArray', '$firebaseObject'];

    function ContactCtrl($scope, $stateParams, $state, identityService, contactService, responseService, $firebaseArray, $firebaseObject) {

        $scope.$parent.main.title = "Contact";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";
        
        $scope.contactSeller = _contactSeller;

        init();

        function init() {
            if ($stateParams.deal == undefined) {
                $state.go("app.dashboard");
            } else {
                $scope.deal = $stateParams.deal;
                $scope.asin = $stateParams.asin;
                $scope.isbn = $stateParams.isbn;
                $scope.ean = $stateParams.ean;
            }

            $scope.contact = {};
            $scope.contact.messages = [];
            if ($scope.$parent.loggedIn) {
                $scope.contact.buyerEmail = identityService.getAuthorizedUserData().email;
            }

        }

        function _contactSeller(valid) {

            if (valid) {
                $scope.contact.bookDeal = $scope.deal.bookDealId;
                var data = {
                    contact: $scope.contact,
                    access_token: identityService.getAccessToken()
                };


                ($scope.contactPromise = contactService.addContact(data)).then(function (response) {
                    responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                    //Adding Realtime Database
                    var username = $scope.deal.username;
                    var ref = firebase.database().ref("/users/" + username + "/contacts");
                    var list = $firebaseArray(ref);

                    list.$add({
                        "buyerEmail":$scope.contact.buyerEmail,
                        "contactId": response.data.success.successData.contactId,
                        "contactDateTime": new Date().toUTCString().substr(0,new Date().toUTCString().length-7),
                        "bookDealId": $scope.deal.bookDealId,
                        "bookTitle": $scope.deal.bookTitle,
                        "buyerNickName": identityService.getAuthorizedUserData().username
                    });

                    $state.go("app.bookComparePrice",{asin:$scope.asin,isbn:$scope.isbn,ean:$scope.ean});


                }).catch(function (response) {
                    responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                    $state.go("app.bookComparePrice",{asin:$scope.asin,isbn:$scope.isbn,ean:$scope.ean});
                });

            }
        }


    }


})();


