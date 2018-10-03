(function () {
    'use strict';

    app
        .controller('AddNewsCtrl', AddNewsCtrl);

    AddNewsCtrl.$inject = ['identityService', 'adminNewsService', 'responseService', '$scope', '$state','$sce'];

    function AddNewsCtrl(identityService, adminNewsService, responseService, $scope, $state,$sce) {

        $scope.$parent.main.title = "Add News";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "user";

        $scope.files = [];
        $scope.removeFile = _removeFile;
        $scope.addNews = _addNews;


        $scope.news = [];
        $scope.newsTypes = [
            {
                id: 'imageType',
                label: 'Image Type'
            },
            {
                id: 'videoType',
                label: 'Video Type'
            }
        ];

        //DatePicker


        $scope.news.newsDateTime = new Date();

        $scope.today = function () {
            $scope.newsDateTime = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.newsDateTime = null;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            'class': 'datepicker'
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.setDate = function (year, month, day) {
            $scope.newsDateTime = new Date(year, month, day);
        };
        $scope.format = 'dd-MMMM-yyyy';
        $scope.popup1 = {
            opened: false
        };

        function _addNews(valid) {
            if ($scope.news.newsType == 'imageType') {
                if ($scope.files.length == 0) {
                    responseService.showErrorToast("Please Enter at least one image");
                } else {
                    if (valid) {
                        var formData = new FormData();
                        var i = 0;
                        angular.forEach($scope.files, function (file) {
                            formData.append("file" + i.toString(), file);
                            i++;
                        });
                        var news = {};

                        news.newsTitle = $scope.news.newsTitle;
                        news.newsDescription = $scope.news.newsDescription;
                        news.newsDateTime = $scope.news.newsDateTime;
                        news.newsType = $scope.news.newsType;

                        formData.append("news", JSON.stringify(news));

                        ($scope.$parent.newsPromise = adminNewsService.addNews(identityService.getAccessToken(), formData)).then(function (response) {
                            responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);

                            $scope.$parent.totalNews.push(response.data.success.successData);


                            $state.go('app.newsManagement');

                        }).catch(function (response) {

                            if (response.data.error_description == "The access token provided is invalid.") {

                            } else if (response.data.error_description == "The access token provided has expired.") {
                                identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                                    identityService.setAccessToken(response.data);
                                    _addNews(valid, quoteType);
                                });
                            } else if (response.data.error != undefined) {

                                responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                            } else {
                                responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                            }

                        });


                    }
                }
            } else if ($scope.news.newsType == 'videoType') {
                if (valid) {
                    var formData = new FormData();
                    var news = {};

                    news.newsTitle = $scope.news.newsTitle;
                    news.newsDescription = $scope.news.newsDescription;
                    news.newsDateTime = $scope.news.newsDateTime;
                    news.newsType = $scope.news.newsType;
                    news.newsVideoEmbedCode = $scope.news.newsVideoEmbedCode;
                    formData.append("news", JSON.stringify(news));

                    ($scope.$parent.newsPromise = adminNewsService.addNews(identityService.getAccessToken(), formData)).then(function (response) {
                        responseService.showSuccessToast(response.data.success.successTitle, response.data.success.successDescription);
                        response.data.success.successData.newsVideoEmbedCode = $sce.trustAsHtml(response.data.success.successData.newsVideoEmbedCode);
                        $scope.$parent.totalNews.push(response.data.success.successData);


                        $state.go('app.newsManagement');

                    }).catch(function (response) {

                        if (response.data.error_description == "The access token provided is invalid.") {

                        } else if (response.data.error_description == "The access token provided has expired.") {
                            identityService.getRefreshAccessToken(identityService.getRefreshToken()).then(function (response) {
                                identityService.setAccessToken(response.data);
                                _addNews(valid, quoteType);
                            });
                        } else if (response.data.error != undefined) {

                            responseService.showErrorToast(response.data.error.errorTitle, response.data.error.errorDescription);
                        } else {
                            responseService.showErrorToast("Something Went Wrong", "Please Refresh the page again.")
                        }

                    });
                }
            }


        }

        function _removeFile(item) {

            console.log($scope);
            $scope.singleFile = false;
            var i = 0;
            angular.forEach($scope.files, function (file) {
                if (file.fileId == item.fileId) {
                    $scope.files.splice($scope.files.indexOf(file), 1);
                }
                i++;
            });
            console.log($scope.files);
        }
    }

})();