'use strict';

app
    .directive('gotoTop', function () {
        return {
            restrict: 'E',
            link: function postLink(scope, element) {
                element.click(function () {
                    $('body,html').stop(true).animate({scrollTop: 0}, 400);
                    return false;
                });

                $(window).on('scroll', function () {
                if ($('body').hasClass('device-lg') || $('body').hasClass('device-md') || $('body').hasClass('device-sm')) {
                    if ($(window).scrollTop() > 450) {
                        element.fadeIn();
                    } else {
                        element.fadeOut();
                    }
                }});

            }
        };
    });
