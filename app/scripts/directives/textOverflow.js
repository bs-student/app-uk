'use strict';

app
    .directive("textOverflow", function () {

        return {

            restrict: "EA",
            replace: true,
            scope: {
                text: '=',
                limit: '=',
                elementType: '='
            },
            template: '<div>' +
                '<div ng-show="showH4">' +
                '<h4 class="blue-text lato item-box-sub-header" ng-show="largeText"> {{ text | subString :0 :end }} ' +
                '   <a href="javascript:;" ng-mouseover="showOnPopOver()" ng-mouseleave="closeOnPopOver()" ng-click="showOnPopOver()" ng-show="isShowMore">...</a>' +
                '   ' +
                '</h4>' +
                '<div style="position: absolute;background: #ffffff;border:1px solid #1780B5;border-radius: 4px;padding: 5px;" ng-show="showPopUp"><p style="margin: 0px;padding: 0px;">{{ text }}</p></div>' +
                '<h4 class="blue-text lato item-box-sub-header" ng-hide="largeText">{{ text }}</h4>' +
                '</div>' +
                '<div ng-show="showH3">' +
                '<h3 class="orange-text lato uppercase item-box-header" ng-show="largeText"> {{ text | subString :0 :end }} ' +
                '   <a href="javascript:;" ng-mouseover="showOnPopOver()" ng-mouseleave="closeOnPopOver()" ng-click="showOnPopOver()" ng-show="isShowMore">...</a>' +
                '   ' +
                '</h3>' +
                '<div style="position: absolute;background: #ffffff;border:1px solid #FF530D;border-radius: 4px;padding: 5px;" ng-show="showPopUp"><p style="margin: 0px;padding: 0px;">{{ text }}</p></div>' +
                '<h3 class="orange-text lato uppercase item-box-header" ng-hide="largeText">{{ text }}</h3>' +
                '</div>' +
                '</div>' +
                '',
            link: function (scope, element, attrs) {



                if (scope.elementType == "h3") {
                    scope.showH3 = true;
                }
                if (scope.elementType == "h4") {
                    scope.showH4 = true;
                }

                scope.end = scope.limit;
                scope.isShowMore = true;
                scope.largeText = true;
                if (scope.text != undefined) {
                    if (scope.text.length <= scope.limit) {
                        scope.largeText = false;
                    }
                }else{
                    scope.showH4=false;
                }


                scope.showOnPopOver = function () {
                    scope.showPopUp = true;
                };
                scope.closeOnPopOver = function () {
                    scope.showPopUp = false;
                }


            }

        };

    })


    .filter('subString', function () {
        return function (str, start, end) {
            if (str != undefined) {
                return str.substr(start, end);
            }
        }
    });

