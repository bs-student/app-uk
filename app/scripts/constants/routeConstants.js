(function () {

    'use strict';

    app
        .constant("SERVER_CONSTANT", {
            "HOST": "http://localhost:8080/Student2StudentApiUk/web/app_dev.php",
            "HOST_APP": "http://localhost:8080/Student2StudentAppUk/app",
            "IMAGE_HOST_PATH": "./../../Student2StudentApiUk/web"
//            "HOST":"http://uktest.student2student.com/api/web",
//            "HOST_APP" : "http://uktest.student2student.com",
//            "IMAGE_HOST_PATH":"./api/web"
//            "HOST":"http://student2student.co.uk/api/web",
//            "HOST_APP" : "http://student2student.co.uk",
//            "IMAGE_HOST_PATH":"./api/web"
        })
        .constant("API_CLIENT_CONSTANT", {
            "CLIENT_ID": "2_50lxf72yzr0gc88s88c0s0k44ckcgcgw08kc8ogkk84ko8gws8",
            "CLIENT_SECRET": "5fnpb8k2kk4ck4s8ggsk4so4s48skkoc4s804k0ksw8oko44ks"
        })
        .constant("ACCESS_TOKEN_CONSTANT", {
            "PASSWORD_GRANT_TYPE": "password",
            "REFRESH_TOKEN_GRANT_TYPE": "refresh_token",
            "CLIENT_CREDENTIALS_GRANT_TYPE": "client_credentials",
            "SOCIAL_PLUGIN_GRANT_TYPE": "http://platform.local/grants/social_plugin",
            "OAUTH_TOKEN_URL": "/oauth/v2/token"
        })
        .constant("SOCIAL_MEDIA_CONSTANT", {
            "FACEBOOK_LINK": "https://www.facebook.com/student2student",
            "TWITTER_LINK": "https://twitter.com/St2StTextbook",
            "INSTAGRAM_LINK": "https://www.instagram.com/st2sttextbook"
        })
        .constant("USER_CONSTANT", {
            "CURRENT_USER_SHORT_DETAILS": "/api/current_user_short_details",
            "CURRENT_USER_FULL_DETAILS": "/api/current_user_full_details",
            "CHANGE_PASSWORD": "/profile/change-password",
            "UPDATE_PROFILE": "/api/update_user_profile",
            "UPDATE_USER_EMAIL_NOTIFICATION_STATUS": "/api/update_user_email_notification_status"
        })
        .constant("ADMIN_CONSTANT", {
            "GET_ALL_NON_APPROVED_USER": "/api/admin/get_all_non_approved_user",
            "GET_ALL_APPROVED_USER": "/api/admin/get_all_approved_user",
            "GET_ALL_ADMIN_USER": "/api/admin/get_all_admin_user",
            "ADMIN_UPDATE_USER_DATA": "/api/admin/update_user_data",
            "APPROVE_USERS": "/api/admin/approve_users",
            "ADD_ADMIN_USER": "/api/admin/add_admin_user",
            "GET_ALL_BOOK_DEALS": "/api/admin/get_all_book_deals",
            "GET_ALL_SOLD_BOOK_DEALS":"/api/admin/get_all_sold_book_deals",
            "GET_STUDENT_QUOTES": "/api/admin/get_student_quotes",
            "GET_UNIVERSITY_QUOTES": "/api/admin/get_university_quotes",
            "UPDATE_QUOTE": "/api/admin/update_quote",
            "ADD_QUOTE": "/api/admin/add_quote",
            "DELETE_QUOTE": "/api/admin/delete_quote",
            "GET_NEWS": "/api/admin/get_news",
            "ADD_NEWS": "/api/admin/add_news",
            "UPDATE_NEWS": "/api/admin/update_news",
            "GET_ALL_NEWSLETTER_EMAILS": "/api/admin/get_all_newsletter_emails",
            "EXPORT_ALL_NEWSLETTER_DATA_INTO_CSV": "/api/admin/export_all_newsletter_data_into_csv",
            "GET_ALL_NON_APPROVED_UNIVERSITIES": "/api/admin/get_all_non_approved_universities",
            "GET_ALL_ACTIVATED_UNIVERSITIES": "/api/admin/get_all_activated_universities",
            "GET_ALL_DEACTIVATED_UNIVERSITIES": "/api/admin/get_all_deactivated_universities",
            "SAVE_EDITED_UNIVERSITY_DATA_ONLY": "/api/admin/save_edited_university_data_only",
            "APPROVE_MULTIPLE_UNIVERSITIES": "/api/admin/approve_multiple_universities",
            "UPDATE_UNIVERSITY_DETAILS": "/api/admin/update_university_details",
            "GET_ALL_SIMILAR_UNIVERSITIES": "/api/admin/get_all_similar_universities",
            "MERGE_UNIVERSITIES": "/api/admin/merge_universities",
            "GET_LOG":"/api/admin/get_log",
            "GET_ALL_DATABASE_LIST":"/api/admin/get_all_databases",
            "DOWNLOAD_DATABASE":"/api/admin/download_database",

            "GET_NORMAL_AND_SOCIAL_USER_DATA":"/api/admin/get_all_normal_and_social_user_data",
            "GET_LOGIN_AND_REGISTRATION_USER_DATA":"/api/admin/get_login_and_registration_user_data",
            "GET_BOOK_DEAL_AND_CONTACT_DATA":"/api/admin/get_book_deal_and_contact_data",
            "GET_BOOK_DEAL_METHOD_DATA":"/api/admin/get_book_deal_method_data",
            "GET_UNIVERSITIES_USER_DATA":"/api/admin/get_universities_user_data",
            "GET_GOOGLE_ACCESS_TOKEN":"/api/admin/get_google_access_token"
        })
        .constant("QUOTE_CONSTANT", {
            "GET_ACTIVATED_STUDENT_QUOTE": "/quote/get_activated_student_quote",
            "GET_ACTIVATED_UNIVERSITY_QUOTE": "/quote/get_activated_university_quote"
        })
        .constant("UNIVERSITY_CONSTANT", {
            "AUTOCOMPLETE_SEARCH_LIST": "/university/autocomplete_activated_search_list",
            "SAVE_NEW_UNIVERSITY": "/university/save_new_university",
            "SAVE_NEW_UNIVERSITY_LOGGED_IN_USER": "/api/university/save_new_university_logged_in_user"
        })
        .constant("CAMPUS_CONSTANT", {
            "CAMPUS_LIST_BY_UNIVERSITY": "/api/campus/list",
            "UPDATE_CAMPUS": "/api/campus/update",
            "ADD_CAMPUS": "/api/campus/add",
            "CAMPUS_DETAILS_WITH_UNIVERSITY_AND_STATE": "/campus/details_with_university_and_state"
        })
        .constant("REFERRAL_CONSTANT", {
            "REFERRAL_LIST": "/referral/list"
        })
        .constant("STATE_CONSTANT", {
            "STATE_LIST_BY_COUNTRY": "/state/list_by_country"
        })
        .constant("COUNTRY_CONSTANT", {
            "COUNTRY_LIST": "/country/list"
        })
        .constant("CONTACT_US_CONSTANT", {
            "SEND_CONTACT_MESSAGE": "/contactus/send_message",
            "SEND_MAILS_TO_FRIENDS": "/contactus/send_mails_to_friends",
            "SEND_MAILS_TO_USER_FRIENDS": "/api/contactus/send_mails_to_user_friends"
        })
        .constant("SECURITY_CONSTANT", {
            "LOGOUT": "/logout",
            "REGISTER": "/register",
            "UPDATE_SOCIAL_USER": "/update_social_user",
            "CONFIRM_REGISTRATION": "/confirm",
            "CHECK_IF_USERNAME_EXIST": "/check_if_username_exist",
            "CHECK_IF_EMAIL_EXIST": "/check_if_email_exist",
            "FORGOT_PASSWORD": "/resetting/send-email",
            "CHECK_RESET_PASSWORD_LINK": "/resetting/check_token",
            "RESET_PASSWORD": "/resetting/reset"
        })
        .constant("LOGIN_CONSTANT", {
            "SUBMIT": "/login_check"
        })
        .constant("BOOK_CONSTANT", {
            "SEARCH_AMAZON": "/book/search_by_keyword_amazon",
            "SEARCH_AMAZON_API": "/api/book/search_by_keyword_amazon_api",
            "GET_LOWEST_ONLINE_PRICE": "/book/get_lowest_price_by_isbn_online",
            "GET_BOOK_BY_ASIN_AMAZON": "/book/search_by_asin_amazon",
            "GET_BOOK_BY_ISBN_AMAZON": "/api/book/search_by_isbn_amazon",
            "GET_BOOK_BY_ISBN_ONLINE_BOOKS": "/book/search_by_isbn_online",
            "GET_AMAZON_CART_CREATE_URL": "/book/get_amazon_cart_create_url",
            "GET_CAMPUS_DEALS_BY_ISBN_API": "/api/book/get_campus_deals_by_isbn_api",
            "GET_CAMPUS_DEALS_BY_ISBN": "/book/get_campus_deals_by_isbn",
            "ADD_NEW_SELL_BOOK": "/api/book/add_new_sell_book",
            "ADD_NEW_CUSTOM_SELL_BOOK": "/api/book/add_new_custom_sell_book"
        })
        .constant("WISHLIST_CONSTANT", {
            "ADD_BOOK_TO_WISH_LIST": "/api/wishlist/add_book_to_wish_list",
            "GET_MY_WISHLIST": "/api/wishlist/get_my_wishlist",
            "REMOVE_WISHLIST_ITEM": "/api/wishlist/remove_wishlist_item",
            "CHECK_IF_ADDED_INTO_WISHLIST": "/api/wishlist/check_if_added_into_wishlist"
        })
        .constant("CONTACT_CONSTANT", {
            "ADD_CONTACT": "/contact/add_contact",
            "ADD_CONTACT_API": "/api/contact/add_contact_api",
            "GET_MESSAGES": "/api/contact/get_messages",
            "SEND_MESSAGES": "/api/contact/send_messages",
            "SEND_MESSAGES_WITHOUT_MAILING": "/api/contact/send_messages_without_mailing"
        })
        .constant("BOOK_DEAL_CONSTANT", {
            "GET_BOOK_DEALS_I_HAVE_CONTACTED_FOR": "/api/book_deal/get_book_deals_i_have_contacted_for",
            "GET_BOOK_DEALS_I_HAVE_CREATED": "/api/book_deal/get_book_deals_i_have_created",
            "SELL_BOOK_TO_USER": "/api/book_deal/sell_book_to_user",
            "GET_BOOK_DEALS_I_HAVE_CREATED_AND_SOLD": "/api/book_deal/get_book_deals_i_have_created_and_sold",
            "GET_BOOK_DEALS_I_HAVE_BOUGHT": "/api/book_deal/get_book_deals_i_have_bought",
            "CHANGE_BOOK_DEAL_STATUS": "/api/book_deal/change_book_deal_status",
            "GET_LOWEST_CAMPUS_DEAL_PRICE": "/api/book_deal/get_lowest_campus_deal_price",
            "UPDATE_BOOK_DEAL": "/api/book_deal/update_book_deal",
            "DELETE_BOOK_DEAL": "/api/book_deal/delete_book_deal",
            "GET_ACTIVATED_BOOK_DEAL_OF_USER": "/book_deal/get_activated_book_deal_of_user",
            "GET_All_ACTIVATED_DEALS_FOR_MESSAGE_BOARD": "/api/book_del/get_all_activated_deals_for_message_board",
            "ADD_BOOK_DEAL_TO_STAR_LIST": "/api/star/add_book_deal_to_star_list",
            "GET_ALL_DATA_FOR_NEW_CONTACT_IN_MESSAGE_BOARD": "/api/star/get_all_data_for_new_contact_in_message_board",
            "GET_BOOK_DEALS_I_HAVE_CREATED_AND_SOLD_FOR_MESSAGE_BOARD": "/api/book_deal/get_book_deals_i_have_created_and_sold_for_message_board"
        })
        .constant("NEWS_CONSTANT", {
            "GET_ACTIVATED_NEWS": "/news/get_activated_news",
            "GET_SINGLE_NEWS": "/news/get_single_news"
        })
        .constant("NEWSLETTER_CONSTANT", {
            "ADD_NEWSLETTER_EMAIL": "/newsletter/add_newsletter_email"
        });
})();