'use strict';


app
    .directive('topHeader', topHeader);

//topHeader.$inject = [];

function topHeader() {
    return {
        restrict: 'A',

        link: function postLink(scope, element, attrs) {

            var shouldBeAddedClass=null;

            superfish();
            toggleMenu();
            chooseMenuStyle();

            var oldHeaderClass = $('#header').attr('class');

            var headerWrapOffset = $('#header-wrap').offset().top;


            attrs.$observe('headerstyle', function(headerstyle) {
                shouldBeAddedClass = headerstyle;
            });



            $(window).on('scroll', function () {
                stickyHeader(headerWrapOffset);
                chooseLogo();
            });


            function superfish() {
                if ($('body').hasClass('device-lg') || $('body').hasClass('device-md')) {
                    $('#main-navbar ul ul, #main-navbar ul .mega-menu-content').css('display', 'block');
                    dropdownPosition();
                }

                $('#main-navbar > ul, #main-navbar > div > ul').superfish({
                    popUpSelector: 'ul,.mega-menu-content',
                    delay: 250,
                    speed: 350,
                    animation: {opacity: 'show'},
                    animationOut: {opacity: 'hide'},
                    cssArrows: false
                });
            }

            function dropdownPosition() {

                $('#main-navbar .mega-menu-content, #main-navbar ul ul').each(function (index, elem) {
                    var $dropdown = $(elem);
                    var windowWidth = $(window).width();
                    var dropdownOffset = $dropdown.offset();
                    var dropdownWidth = $dropdown.width();
                    var dropdownPosition = dropdownOffset.left;

                    if (windowWidth - (dropdownWidth + dropdownPosition) < 0) {
                        $dropdown.addClass('menu-right-position');
                    }
                });

            }

            function toggleMenu() {
                $('#main-navbar-toggle').click(function () {
                    $('#main-navbar > ul').toggleClass("show");
                    return false;
                });
            }

            function stickyHeader(headerOffset) {
                if ($(window).scrollTop() > headerOffset) {
                    if (( $('body').hasClass('device-lg') || $('body').hasClass('device-md') )) {
                        $('#header').addClass('sticky-header');
                            $('#header').removeClass('light');
                    } else if ($('body').hasClass('device-xs') || $('body').hasClass('device-xxs') || $('body').hasClass('device-sm')) {
                        if ($('#header').hasClass('sticky-mobile')) {
                            $('#header').addClass('responsive-sticky-header');
                        }
                    } else {
                        unStickyHeader();
                    }
                } else {
                    unStickyHeader();
                }
            }

            function unStickyHeader() {
                if ($('#header').hasClass('sticky-header')) {
                    $('#header').removeClass('sticky-header');
                    $('#header').removeClass().addClass(oldHeaderClass);
                    $('#header').addClass(shouldBeAddedClass);

                }
                if ($('#header').hasClass('responsive-sticky-header')) {
                    $('#header').removeClass('responsive-sticky-header');
                }
            }

            function chooseMenuStyle(headerOffset) {
                if ($('body').hasClass('device-xs') || $('body').hasClass('device-xxs') || $('body').hasClass('device-sm')) {
                    $('#header').removeClass('light');
                    if (!$('#header').hasClass('sticky-mobile')) {
                        unStickyHeader();
                    }
                } else {
                    if ($(window).scrollTop() > headerOffset) {
                        $('#header').addClass('sticky-header');
                    }
                }
            }

            function chooseLogo() {

                var defaultLogo = $('#branding').find('.brand-normal'),
                    retinaLogo = $('#branding').find('.brand-retina'),
                    defaultLogoImg = defaultLogo.find('img').attr('src'),
                    retinaLogoImg = retinaLogo.find('img').attr('src'),
                    defaultLightLogo = defaultLogo.attr('data-light-logo'),
                    retinaLightLogo = retinaLogo.attr('data-light-logo');

                if ($('#header').hasClass('light')) {
                    if (defaultLightLogo) {
                        defaultLogo.find('img').attr('src', defaultLightLogo);
                    }
                    if (retinaLightLogo) {
                        retinaLogo.find('img').attr('src', retinaLightLogo);
                    }
                } else {
                    if (defaultLogoImg) {
                        defaultLogo.find('img').attr('src', defaultLogoImg);
                    }
                    if (retinaLogoImg) {
                        retinaLogo.find('img').attr('src', retinaLogoImg);
                    }
                }
            }
        }


    };
}