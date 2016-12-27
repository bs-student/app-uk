'use strict';



/*jshint -W079 */

var app = angular
    .module('student2studentApp', [

        'satellizer',

        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
//        'ngTouch',
//        'ngMessages',
        'picardy.fontawesome',
        'ui.bootstrap',
        'ui.router',
        'ui.utils',
        'angular-loading-bar',
//        'angular-momentjs',
//        'FBAngular',
//        'lazyModel',
        'toastr',
//        'angularBootstrapNavTree',
        'oc.lazyLoad',
        'ui.select',
//        'ui.tree',
        'textAngular',
//        'colorpicker.module',
//        'angularFileUpload',
//        'ngImgCrop',
//        'datatables',
//        'datatables.bootstrap',
//        'datatables.colreorder',
//        'datatables.colvis',
//        'datatables.tabletools',
//        'datatables.scroller',
//        'datatables.columnfilter',
//        'ui.grid',
//        'ui.grid.resizeColumns',
//        'ui.grid.edit',
//        'ui.grid.moveColumns',
        'ngTable',
//        'smart-table',
//        'angular-flot',
//        'angular-rickshaw',
//        'easypiechart',
//        'uiGmapgoogle-maps',
//        'ui.calendar',
//        'ngTagsInput',
        'pascalprecht.translate',
//        'ngMaterial',
//        'localytics.directives',
//        'leaflet-directive',
//        'wu.masonry',
//        'ipsum',
//        'angular-intro',
//        'dragularModule'

//        'angular-parallax'
        'ngParallax',
//        'noCAPTCHA'
        'vcRecaptcha',
        'cgBusy',
//        'duScroll',
        '720kb.socialshare',
        'jkuri.slimscroll',
        'firebase',
        'ngScrollGlue'
//        'ui.slimscroll'
    ])
    .run(['$rootScope', '$state', '$stateParams','imageStoreService' ,function ($rootScope, $state, $stateParams,imageStoreService) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {

            event.targetScope.$watch('$viewContentLoaded', function () {

                if(toState.name!="app.bookBuy.bookSearch"){
                    angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);
                }


                setTimeout(function () {
                    angular.element('#wrap').css('visibility', 'visible');

                    if (!angular.element('.dropdown').hasClass('open')) {
                        angular.element('.dropdown').find('>ul').slideUp();
                    }
                }, 200);
            });
            $rootScope.containerClass = toState.containerClass;

            imageStoreService.removeAllStoredImages();
        });




    }])
    .config(function() {
        var config = {
            apiKey: "AIzaSyBt6xW_YAKwAPEHP7j397IVfr5a1MzwaGA",
            authDomain: "student2studentuk.firebaseapp.com",
            databaseURL: "https://student2studentuk.firebaseio.com",
            storageBucket: "student2studentuk.appspot.com"
        };
        firebase.initializeApp(config);
    })

    .config(['uiSelectConfig', function (uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
    }])
    .config(['vcRecaptchaServiceProvider',function(vcRecaptchaServiceProvider){
        vcRecaptchaServiceProvider.setSiteKey('6LeMeykTAAAAAHDayXgyff_OX7erYAnPoUKnLrR-');
        vcRecaptchaServiceProvider.setTheme('dark');
    }])



    //angular-language
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        });
        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
    }])


    .config(['$authProvider',function($authProvider) {

        $authProvider.facebook({
            clientId: '214816590624',
            url:'http://student2student.com/api/web/auth/facebook'


        });
        $authProvider.google({
            clientId: '19322012790-7i3k71ps5r6cujo4h87j9husfvjombsn.apps.googleusercontent.com',
            url:'http://student2student.com/api/web/auth/google'

        });

    }])


    .config(['$stateProvider', '$urlRouterProvider','authCheckerServiceProvider','$locationProvider', function ($stateProvider, $urlRouterProvider,authCheckerServiceProvider,$locationProvider) {
        var authCheck = {
            authCheck: function() {
                return authCheckerServiceProvider.$get().checkIfLoggedIn();
            }
        };

        var adminCheck = {
            adminCheck: function() {
                return authCheckerServiceProvider.$get().checkIfAdminLoggedIn();
            }
        };

        var authCheckNormal = {
            authCheckNormal: function() {
                return authCheckerServiceProvider.$get().checkIfLoggedInNormal();
            }
        };


        $urlRouterProvider
//            .when('/:', '/contacts/:id')
//            .when('/access_token=:accessToken','')
            .otherwise('/');
        $stateProvider


            ////////////////////// Public View Routes ///////////////////////

            .state('app', {
                abstract: true,
                url: '/',
                controller: 'StartCtrl',
                templateUrl: 'views/web/app.html'
            })
            //dashboard
            .state('app.dashboard', {
                url: '^/',
                controller: 'DashboardCtrl',
                templateUrl: 'views/web/dashboard.html'
            })
            //dashboard Redirect index.html
            .state('app.index_html', {
                url: '^/index.html',
                templateUrl: 'views/web/dashboard.html',
                redirectTo: 'app.dashboard'
            })
            //dashboard Redirect index.php
            .state('app.index_php', {
                url: '^/index.php',
                templateUrl: 'views/web/dashboard.html',
                redirectTo: 'app.dashboard'
            })

            //how It Work page
            .state('app.howItWorks', {
                url: '^/howItWorks',
                controller: 'HowItWorksCtrl',
                templateUrl: 'views/web/howItWorks.html'
            })

            //concept Video page
            .state('app.conceptVideo', {
                url: '^/conceptVideo',
                controller: 'ConceptVideoCtrl',
                templateUrl: 'views/web/conceptVideo.html'
            })

            //login
            .state('app.login', {
                url: '^/login',
                controller: 'LoginCtrl',
                templateUrl: 'views/security/login.html',
                params: {
                    "bookId": null
                }
            })

            // Add University Public
            .state('app.addUniversity', {
                url: '^/addUniversity',
                controller: 'UniversityCtrl',
                templateUrl: 'views/university/university.html'
            })
            // University Map
            .state('app.universityMap', {
                url: '^/universityMap',
                controller: 'UniversityMapCtrl',
                templateUrl: 'views/university/university_map.html'
            })

            //Registration
            .state('app.signup', {
                url: '^/signup',
                controller: 'SignupCtrl',
                templateUrl: 'views/security/signup.html',
                params: {
                    "email": null
                }
            })
            //Registration Confirm
            .state('app.confirm', {
                url: '^/confirmRegistration/:code',
                controller: 'SignupConfirmCtrl'
            })
            //forgot password
            .state('app.forgotPassword', {
                url: '^/forgotPassword',
                controller: 'ForgotPasswordCtrl',
                templateUrl: 'views/security/forgotpassword.html'
            })
            //reset Password password
            .state('app.resetPassword', {
                url: '^/resetPassword/:code',
                controller: 'ResetPasswordCtrl',
                templateUrl: 'views/security/resetpassword.html'
            })

            //book Buy
            .state('app.bookBuy', {
                url: '^/bookBuy',
                controller: 'BookBuyCtrl',
                templateUrl: 'views/book/buy_book.html'
            })
            //book Search
            .state('app.bookBuy.bookSearch', {
                url: '^/bookSearch/:searchQuery?pageNumber&campus',
                views:{
                    'searchResultView@app.bookBuy':{
                        templateUrl: 'views/book/search_result.html',
                        controller: 'BookSearchCtrl'
                    }
                },
                resolve:authCheckNormal

            })
            //compare page
            .state('app.bookComparePrice', {
                url: '^/bookComparePrice/:asin?isbn',
                controller: 'BookCompareCtrl',
//                templateUrl: 'views/book/compare.html'
                templateUrl: 'views/book/compare_book_price.html',
                resolve:authCheckNormal
            })
            //If Buy From Amazon
            .state('app.buyFromAmazon', {
                url: '^/buyFromAmazon/:bookOfferId',
                controller: 'BookBuyFromAmazonCtrl'
            })
            //Contact BuyerToSeller
            .state('app.contact', {
                url: '^/contact',
                controller: 'ContactCtrl',
                templateUrl: 'views/contact/contact.html',
                params: {
                    "deal": null,
                    "isbn": null,
                    "asin" :null
                }

            })
            //Complete Registration
            .state('app.completeRegistration', {
                url: '^/completeRegistration',
                controller: 'SocialRegisterCompleteCtrl',
                templateUrl: 'views/security/complete_registration.html',
                params: {
                    "user": null
                }

            })
            //Contact Us
            .state('app.contactUs', {
                url: '^/contactUs',
                controller: 'ContactUsCtrl',
                templateUrl: 'views/web/contact_us.html'
            })
            //Public News
            .state('app.news', {
                url: '^/news',
                controller: 'NewsCtrl',
                templateUrl: 'views/news/news.html'
            })
            //News Details
            .state('app.newsDetails', {
                url: '^/newsDetails/:newsId',
                controller: 'NewsDetailsCtrl',
                templateUrl: 'views/news/news_details.html'
            })
            //Tell My Friends
            .state('app.tellFriends', {
                url: '^/tellFriends',
                controller: 'TellFriendsCtrl',
                templateUrl: 'views/web/tell_friends.html'
            })



            //Privacy Policy
            .state('app.privacyPolicy', {
                url: '^/privacyPolicy',
                controller: 'PrivacyPolicyCtrl',
                templateUrl: 'views/web/privacy_policy.html'
            })
            //Disclaimer
            .state('app.disclaimer', {
                url: '^/disclaimer',
                controller: 'DisclaimerCtrl',
                templateUrl: 'views/web/disclaimer.html'
            })

            //Condition of Use
            .state('app.conditionOfUse', {
                url: '^/conditionOfUse',
                controller: 'ConditionOfUseCtrl',
                templateUrl: 'views/web/condition_of_use.html'
            })
            //BUY FROM AMAZON
            .state('app.buy_from_amazon', {
                url: '^/buy_from_amazon:bookOfferId',
                controller: 'BookBuyFromAmazonCtrl'
            })
            //Safety First
            .state('app.safetyFirst', {
                url: '^/safetyFirst',
                controller: 'SafetyFirstCtrl',
                templateUrl: 'views/web/safety_first.html'
            })
            //Scam & Fraud
            .state('app.scamAndFraud', {
                url: '^/scamAndFraud',
                controller: 'ScamFraudCtrl',
                templateUrl: 'views/web/scam_fraud.html'
            })
            //FAQ
            .state('app.faq', {
                url: '^/faq',
                controller: 'FaqCtrl',
                templateUrl: 'views/web/faq.html'
            })

            //Access Denied
            .state('app.accessDenied', {
                url: '^/accessDenied',
                templateUrl: 'views/web/accessDenied.html'
            })

            /////////////////////// Logged In User Routes /////////////////


            //Promote my sell page
            .state('app.promoteMyStore', {
                url: '^/promoteMyStore',
                controller: 'TellFriendsCtrl',
                templateUrl: 'views/web/tell_friends.html',
                resolve: authCheck
            })


            //Contacted Book List
            .state('app.contactedBookList', {
                url: '^/contactedBookList',
                controller: 'ContactedBookListCtrl',
                templateUrl: 'views/book/contacted_book_list.html',
                resolve: authCheck
            })
            //Selling Book List
            .state('app.sellingBookList', {
                url: '^/sellingBookList',
                controller: 'SellingBookListCtrl',
                templateUrl: 'views/book/selling_book_list.html',
                resolve: authCheck
            })
            //Sell Archive
            .state('app.sellArchive', {
                url: '^/sellArchive',
                controller: 'SellArchiveCtrl',
                templateUrl: 'views/book/sell_archive.html',
                resolve: authCheck
            })
            //Buy Archive
            .state('app.buyArchive', {
                url: '^/buyArchive',
                controller: 'BuyArchiveCtrl',
                templateUrl: 'views/book/buy_archive.html',
                resolve: authCheck
            })

            //Wishlist
            .state('app.wishList', {
                url: '^/wishList',
                controller: 'WishListCtrl',
                templateUrl: 'views/book/wishlist.html',
                resolve: authCheck
            })
            //Profile
            .state('app.profile', {
                url: '^/profile',
                controller: 'ProfileCtrl',
                templateUrl: 'views/account/profile.html',
                resolve: authCheck
            })
            //Change Password
            .state('app.changePassword', {
                url: '^/changePassword',
                controller: 'ChangePasswordCtrl',
                templateUrl: 'views/account/change_password.html',
                resolve: authCheck
            })

            //Sell Book Main Page
            .state('app.sellBook', {
                url: '^/sellBook',
                controller: 'BookSellMainCtrl',
                templateUrl: 'views/book/sell_book.html',
                resolve: authCheck

            })
            //Sell Book
            .state('app.sellBookByIsbn', {
                url: '^/sellBookByIsbn',
                controller: 'BookSellCtrl',
                templateUrl: 'views/book/sell_page.html',
                params: {
                    "book": null
                },
                resolve: authCheck
            })
            //Sell Book Custom
            .state('app.sellBookCustom', {
                url: '^/sellBookCustom',
                controller: 'BookSellCustomCtrl',
                templateUrl: 'views/book/sell_page_custom.html',
                resolve: authCheck
            })



            //Edit Book Deal
            .state('app.editBookDeal', {
                url: '^/editBookDeal',
                controller: 'BookDealEditCtrl',
                templateUrl: 'views/book/book_deal_edit_page.html',
                params: {
                    "book": null
                },
                resolve: authCheck
            })

            //Message Board
            .state('app.messageBoard', {
                url: '^/messageBoard',
                controller: 'MessageBoardCtrl',
                templateUrl: 'views/message/messageBoard.html',
                resolve: authCheck
            })






            //////////////////////// ADMIN Routes ////////////////
            //AdminUserList
            .state('app.userList', {
                url: '^/userList',
                controller: 'UserManagementCtrl',
                templateUrl: 'views/admin/user/user_list.html',
                resolve: adminCheck
            })
            //Admin University Management
            .state('app.universityManagement', {
                url: '^/universityManagement',
                controller: 'UniversityManagementCtrl',
                templateUrl: 'views/admin/university/university_management.html',
                resolve: adminCheck
            })
            //Admin Edit University
            .state('app.universityEdit', {
                url: '^/universityEdit',
                controller: 'UniversityEditCtrl',
                templateUrl: 'views/admin/university/university_edit.html',
                params: {
                    "university": null
                },
                resolve: adminCheck
            })

            //Admin Merge University
            .state('app.universityMerge', {
                url: '^/universityMerge',
                controller: 'UniversityMergeCtrl',
                templateUrl: 'views/admin/university/university_merge.html',
                params: {
                    "university": null
                },
                resolve: adminCheck
            })

            //Add User
            .state('app.userList.addUser', {
                url: '^/addUser',
                views:{
                    'addUserView@app.userList':{
                        templateUrl: 'views/admin/user/add_user.html',
                        controller: 'AddUserCtrl'
                    }
                },
                resolve: adminCheck

            })
            //Admin All Book Deals
            .state('app.allBookDeals', {
                url: '^/allBookDeals',
                controller: 'BookDealCtrl',
                templateUrl: 'views/admin/book/book_deals.html',
                resolve: adminCheck
            })
            //Admin Quotes
            .state('app.quotes', {
                url: '^/quotes',
                controller: 'QuoteCtrl',
                templateUrl: 'views/admin/content/quotes.html',
                resolve: adminCheck
            })
            //Add Student Quote
            .state('app.quotes.addStudentQuote', {
                url: '^/addStudentQuote',
                views:{
                    'addStudentQuoteView@app.quotes':{
                        templateUrl: 'views/admin/content/add_student_quote.html',
                        controller: 'AddQuoteCtrl'
                    }
                },
                resolve: adminCheck

            })
            //Add University Quote
            .state('app.quotes.addUniversityQuote', {
                url: '^/addUniversityQuote',
                views:{
                    'addUniversityQuoteView@app.quotes':{
                        templateUrl: 'views/admin/content/add_university_quote.html',
                        controller: 'AddQuoteCtrl'
                    }
                },
                resolve: adminCheck

            })
            //Admin News
            .state('app.newsManagement', {
                url: '^/newsManagement',
                controller: 'NewsManagementCtrl',
                templateUrl: 'views/admin/content/news.html',
                resolve: adminCheck
            })
            //Add Student Quote
            .state('app.newsManagement.addNews', {
                url: '^/addNews',
                views:{
                    'addNewsView@app.newsManagement':{
                        templateUrl: 'views/admin/content/add_news.html',
                        controller: 'AddNewsCtrl'
                    }
                },
                resolve: adminCheck

            })
            //Admin Newsletter
            .state('app.newsletter', {
                url: '^/newsletter',
                controller: 'NewsletterCtrl',
                templateUrl: 'views/admin/newsletter/newsletter.html',
                resolve: adminCheck
            })

            //Admin Log
            .state('app.log', {
                url: '^/log',
                controller: 'LogCtrl',
                templateUrl: 'views/admin/log/log.html',
                resolve: adminCheck
            })

            //Admin Databases
            .state('app.databases', {
                url: '^/databases',
                controller: 'DatabaseCtrl',
                templateUrl: 'views/admin/databases/databases.html',
                resolve: adminCheck
            })

            //////////////////// My Sell Page //////////////

            //My Sells Page
            .state('app.mySellPage', {
                url: '^/:username',
                controller: 'MySellPageCtrl',
                templateUrl: 'views/web/my_sell_page.html'
            });

        $locationProvider.html5Mode(true);

    }]);

