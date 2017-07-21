var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")({
        lazy: true
    }),
    runSequence = require("run-sequence");

var assets = {

    js_library_1: [

        "bower_components/jquery/jquery.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",

        "bower_components/angular-cookies/angular-cookies.js",
        "bower_components/angular-fontawesome/dist/angular-fontawesome.js",
        "bower_components/angular-loading-bar/build/loading-bar.js",
        "bower_components/angular-aria/angular-aria.js",

        "bower_components/angular-resource/angular-resource.js",
        "bower_components/angular-toastr/dist/angular-toastr.tpls.js",
        "bower_components/angular-translate/angular-translate.js",
        "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
        "bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js",
        "bower_components/angular-translate-storage-local/angular-translate-storage-local.js",
        "bower_components/angular-ui-router/release/angular-ui-router.js",
        "bower_components/angular-ui-select/dist/select.js",
        "bower_components/angular-ui-utils/ui-utils.js",


        "bower_components/ng-table/dist/ng-table.js",
        "bower_components/oclazyload/dist/ocLazyLoad.js",
        "bower_components/angular-recaptcha/release/angular-recaptcha.js",
        "bower_components/angular-busy/dist/angular-busy.js",
        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/satellizer/dist/satellizer.js",

        "bower_components/angular-socialshare/dist/angular-socialshare.js",
        "bower_components/ngSlimscroll/src/js/ngSlimscroll.js",
        "bower_components/chart.js/dist/Chart.js",
        "bower_components/angular-chart.js/dist/angular-chart.js"



    ],
    js_library_2: [

        "bower_components/moment/moment.js",
        "bower_components/angular-momentjs/angular-momentjs.js",
        "bower_components/bootstrap-daterangepicker/daterangepicker.js",

        "bower_components/firebase/firebase.js",
        "bower_components/angularfire/dist/angularfire.js",


        "bower_components/textAngular/dist/textAngular.js",
        "bower_components/textAngular/dist/textAngularSetup.js",
        "bower_components/textAngular/dist/textAngular-sanitize.js",
        "bower_components/textAngular/dist/textAngular-rangy.min.js",
        "bower_components/ng-scroll-glue/dist/ng-scroll-glue.js",




        "vendor/superfish/js/superfish.js",
        "vendor/jRespond/jRespond.js",
        "vendor/smoothscroll/SmoothScroll.js",
        "vendor/appear/jquery.appear.js",

        "vendor/flexslider/jquery.flexslider.js",

        "vendor/animsition/js/jquery.animsition.js",
        "vendor/rs-plugin/js/jquery.themepunch.tools.min.js",
        "vendor/rs-plugin/js/jquery.themepunch.revolution.js",
        "vendor/ng-parallax-master/js/ngParallax.js",
        "vendor/filestyle/bootstrap-filestyle.min.js",
        "vendor/jquery-simscroll/jquery.slimscroll.js",
        "vendor/google/analytics/embed-api-active-users.js",

        "app/assets/js/global.js"
    ],
    js_app:[

        "app/scripts/app.js",

        "app/scripts/constants/configConstants.js",
        "app/scripts/constants/routeConstants.js",

        "app/scripts/controllers/mainCtrl.js",
        "app/scripts/controllers/bookBuyFromAmazonCtrl.js",
        "app/scripts/controllers/bookCompareCtrl.js",
        "app/scripts/controllers/bookSearchCtrl.js",
        "app/scripts/controllers/bookSellCtrl.js",
        "app/scripts/controllers/changePasswordCtrl.js",
        "app/scripts/controllers/dashboardCtrl.js",
        "app/scripts/controllers/forgotPasswordCtrl.js",
        "app/scripts/controllers/loginCtrl.js",
        "app/scripts/controllers/socialRegisterCompleteCtrl.js",
        "app/scripts/controllers/profileCtrl.js",
        "app/scripts/controllers/resetPasswordCtrl.js",
        "app/scripts/controllers/signupConfirmCtrl.js",
        "app/scripts/controllers/signupCtrl.js",
        "app/scripts/controllers/startCtrl.js",
        "app/scripts/controllers/universityCtrl.js",
        "app/scripts/controllers/universityManagementCtrl.js",
        "app/scripts/controllers/userManagementCtrl.js",
        "app/scripts/controllers/universityMapCtrl.js",
        "app/scripts/controllers/modalInstanceCtrl.js",
        "app/scripts/controllers/howItWorksCtrl.js",
        "app/scripts/controllers/conceptVideoCtrl.js",
        "app/scripts/controllers/bookBuyCtrl.js",
        "app/scripts/controllers/contactCtrl.js",
        "app/scripts/controllers/contactedBookListCtrl.js",
        "app/scripts/controllers/sellingBookListCtrl.js",
        "app/scripts/controllers/sellArchiveCtrl.js",
        "app/scripts/controllers/buyArchiveCtrl.js",
        "app/scripts/controllers/safetyFirstCtrl.js",
        "app/scripts/controllers/scamFraudCtrl.js",
        "app/scripts/controllers/wishListCtrl.js",
        "app/scripts/controllers/addUserCtrl.js",
        "app/scripts/controllers/bookDealCtrl.js",
        "app/scripts/controllers/quoteCtrl.js",
        "app/scripts/controllers/addQuoteCtrl.js",
        "app/scripts/controllers/faqCtrl.js",
        "app/scripts/controllers/bookSellMainCtrl.js",
        "app/scripts/controllers/bookSellCustomCtrl.js",
        "app/scripts/controllers/newsManagementCtrl.js",
        "app/scripts/controllers/addNewsCtrl.js",
        "app/scripts/controllers/newsCtrl.js",
        "app/scripts/controllers/contactUsCtrl.js",
        "app/scripts/controllers/newsDetailsCtrl.js",
        "app/scripts/controllers/bookDealEditCtrl.js",
        "app/scripts/controllers/mySellPageCtrl.js",
        "app/scripts/controllers/tellFriendsCtrl.js",
        "app/scripts/controllers/newsletterCtrl.js",
        "app/scripts/controllers/privacyPolicyCtrl.js",
        "app/scripts/controllers/disclaimerCtrl.js",
        "app/scripts/controllers/conditionOfUseCtrl.js",
        "app/scripts/controllers/messageBoardCtrl.js",
        "app/scripts/controllers/universityEditCtrl.js",
        "app/scripts/controllers/universityMergeCtrl.js",
        "app/scripts/controllers/logCtrl.js",
        "app/scripts/controllers/databaseCtrl.js",
        "app/scripts/controllers/conceptVideoSpanishCtrl.js",
        "app/scripts/controllers/adminUserReportCtrl.js",
        "app/scripts/controllers/adminUniversityReportCtrl.js",
        "app/scripts/controllers/adminBookDealReportCtrl.js",
        "app/scripts/controllers/googleAnalyticsReportCtrl.js",
        "app/scripts/controllers/adminUserBrowsingReportCtrl.js",


        "app/scripts/directives/anchor-scroll.js",
        "app/scripts/directives/angular.flexslider.js",
        "app/scripts/directives/check-toggler.js",
        "app/scripts/directives/multipleImageInput.js",
        "app/scripts/directives/formsubmit.js",
        "app/scripts/directives/gotoTop.js",
        "app/scripts/directives/homeSlider.js",
        "app/scripts/directives/lazymodel.js",
        "app/scripts/directives/native-tab.js",
        "app/scripts/directives/offcanvas-sidebar.js",
        "app/scripts/directives/onblurvalidation.js",
        "app/scripts/directives/pageloader.js",
        "app/scripts/directives/ripple.js",
        "app/scripts/directives/slimscroll.js",
        "app/scripts/directives/sparkline.js",
        "app/scripts/directives/submitvalidate.js",
        "app/scripts/directives/topHeader.js",
        "app/scripts/directives/textOverflow.js",
        "app/scripts/directives/singleImageInput.js",
        "app/scripts/directives/stringToNumber.js",
        "app/scripts/directives/daterangepicker.js",

        "app/scripts/services/apiService.js",
        "app/scripts/services/bookService.js",
        "app/scripts/services/campusService.js",
        "app/scripts/services/countryService.js",
        "app/scripts/services/identityService.js",
        "app/scripts/services/loginService.js",
        "app/scripts/services/responseService.js",
        "app/scripts/services/referralService.js",
        "app/scripts/services/securityService.js",
        "app/scripts/services/stateService.js",
        "app/scripts/services/tokenService.js",
        "app/scripts/services/universityService.js",
        "app/scripts/services/userService.js",
        "app/scripts/services/imageModalService.js",
        "app/scripts/services/contactService.js",
        "app/scripts/services/storageService.js",
        "app/scripts/services/bookDealService.js",
        "app/scripts/services/wishListService.js",
        "app/scripts/services/adminUserService.js",
        "app/scripts/services/adminBookDealService.js",
        "app/scripts/services/adminQuoteService.js",
        "app/scripts/services/adminNewsService.js",
        "app/scripts/services/newsService.js",
        "app/scripts/services/contactUsService.js",
        "app/scripts/services/quoteService.js",
        "app/scripts/services/newsletterService.js",
        "app/scripts/services/imageStoreService.js",
        "app/scripts/services/authCheckerService.js",
        "app/scripts/services/eventService.js",
        "app/scripts/services/adminUniversityService.js",
        "app/scripts/services/adminLogService.js",
        "app/scripts/services/adminDatabaseService.js",
        "app/scripts/services/adminReportService.js",

        "app/scripts/validators/valEmail.js",
        "app/scripts/validators/valUsername.js",
        "app/scripts/validators/valUsernameSpecialChar.js",

        "app/scripts/filters/sanitizeHtml.js"
    ],

    css_library: [

        "vendor/flexslider/flexslider.css",

        "vendor/rs-plugin/css/settings.css",
        "vendor/animsition/css/animsition.css",

        "bower_components/bootstrap/dist/css/bootstrap.css",
        "bower_components/font-awesome/css/font-awesome.css",
        "bower_components/angular-loading-bar/build/loading-bar.css",

        "bower_components/angular-toastr/dist/angular-toastr.css",
        "bower_components/angular-ui-select/dist/select.css",
        "bower_components/animate.css/animate.css",

        "bower_components/ng-table/dist/ng-table.css",

        "bower_components/angular-busy/dist/angular-busy.css",
        "bower_components/textAngular/dist/textAngular.css",
        "bower_components/bootstrap-daterangepicker/daterangepicker.css"


    ],
    css_website:[
        "app/assets/css/style.css",
        "app/assets/css/myStyle.css",
        "app/styles/theme-main.css"
    ],
    css_website_assets:[

        "app/assets/**/*",
        "!app/assets/css/*",
        "!app/assets/js/*",
        "!app/assets/scss/**/*",
        "assets/js/global.js"
    ]

};

gulp.task("watch", function () {
    "use strict";

    gulp.watch(assets.js, ["js_app"]);
    gulp.watch(assets.css, ["css_website"]);
});

gulp.task("clean", function (done) {
    "use strict";
});

gulp.task("js_library_1", function (done) {
    "use strict";

    return gulp.src(assets.js_library_1)
        .pipe(plugins.print())
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.concat('app.library1-2.1.min.js'))
        .pipe(gulp.dest('app/dist/js'));
});

gulp.task("js_library_2", function (done) {
    "use strict";

    return gulp.src(assets.js_library_2)
        .pipe(plugins.print())
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.concat('app.library2-2.1.min.js'))
        .pipe(gulp.dest('app/dist/js'));
});


gulp.task("js_app", function (done) {
    "use strict";

    return gulp.src(assets.js_app)
        .pipe(plugins.print())
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.concat('app-2.5.min.js'))
        .pipe(gulp.dest('app/dist/js'));
});
gulp.task("css_website", function (done) {
    "use strict";

    return gulp.src(assets.css_website)
        .pipe(plugins.print())
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('app-2.8.min.css'))
        .pipe(gulp.dest('app/dist/css'));
});

gulp.task("css_library", function (done) {
    "use strict";

    return gulp.src(assets.css_library)
        .pipe(plugins.print())
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('app.library-2.1.min.css'))
        .pipe(gulp.dest('app/dist/css'));
});

gulp.task("css_website_assets", function (done) {
    "use strict";

    return gulp.src(assets.css_website_assets)

        .pipe(plugins.print())
        .pipe(gulp.dest('app/dist'));
});

gulp.task("default", function (done) {
    "use strict";

    runSequence("js_library_1","js_library_2","js_app", "css_library","css_website", "css_website_assets",["watch"], done);
});