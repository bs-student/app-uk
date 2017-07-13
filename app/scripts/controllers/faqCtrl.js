(function () {

    'use strict';

    app
        .controller('FaqCtrl', FaqCtrl);

    FaqCtrl.$inject = ['$scope', '$sce','SERVER_CONSTANT'];

    function FaqCtrl($scope, $sce,SERVER_CONSTANT) {

        $scope.appHostPath = SERVER_CONSTANT.HOST_APP;
        $scope.$parent.main.title = "FAQ";
        $scope.$parent.headerStyle = "dark";
        $scope.$parent.activePage = "helpAndSafety";

        $scope.downloadBookmarkForPrint = _downloadBookmarkForPrint;
        $scope.oneAtATime = false;

        $scope.faqList = [


            {
                tabId: "tab_1",
                linkText: "student2student.co.uk",
                active: true,
                faqs: [
                    {
                        question: "How does Student2Student work?",
                        answer: $sce.trustAsHtml('<iframe style="border:3px solid #FF530D !important; border-radius: 4px;" width="100%" height="315" src="https://www.youtube.com/embed/lXvwHtAXAXQ" frameborder="0" allowfullscreen></iframe>')
                    },
                    {
                        question: "Is Student2Student really free?",
                        answer: "Yes, Student 2 Student is absolutely free to all students. Buying, selling, comparing, contacting others is available to you at no charge! We want you to save big money!"
                    },
                    {
                        question: "Why do I need to Sign Up at my University?",
                        answer: "Yes and No. You can search, compare and buy textbooks without an account on Student 2 Student. Some sellers may not make the textbook available for non-members. In this case you will need an account. To sell a textbook you will need an account on Student 2 Student. You will need to sign up for you University location / campus."
                    },
                    {
                        question: "Do I need a credit card?",
                        answer: $sce.trustAsHtml("No! You do not need a credit card for anything on Student 2 Student. Never provide your credit card information to anyone. If someone claims he/she needs the credit card information, please contact Student 2 Student <a href='http://www.student2student.co.uk/contactUs'>here</a>. Never give out your credit card information. Student 2 Student doesn't need it, and neither do members of Student 2 Student.")
                    }

                    ,
                    {
                        question: "What is the COE (Cash on Exchange) concept?",
                        answer: "The Cash on Exchange (COE) concept is very simple. It means you only give out the textbook when the buyer gives you the money. Exchange on the spot. Buyer gets the textbooks :: Seller gets the money."
                    }
                ]
            },

            {
                tabId: "tab_3",
                linkText: "seller's handbook",
                faqs: [
                    {
                        question: "How do I sell my textbooks?",
                        answer: "It couldn't be easier! Sign In or Sign Up, go to \"Sell Books\", enter the ISBN, and define the deal (price, date available, etc.). You do not need to enter any textbook information. We do it all for you!"
                    },

                    {
                        question: "Do I need an account to sell textbooks?",
                        answer: "Yes you will need an account in order to sell your textbooks to other student on campus."
                    },
                    {
                        question: "Can I post my textbooks on Facebook and Twitter?",
                        answer: "Of course! Talk about increasing your chances to sell the textbook. When you Sell the textbook, you can post the the deal on Facebook or Twitter."
                    },
                    {
                        question: 'Does the seller see my name and contact information?',
                        answer: "When you sign up, you have to define a Nickname to protect your real name. Buyers will see your Nickname when looking up textbooks. Depending upon your deal settings, either Buyer contacts Seller or Seller contacts Buyer, the buyer will get your contact information you defined in the deal through email. The buyer must request the information. The contact information is not published publicly on Student 2 Student."
                    },
                    {
                        question: "Do I need to ship the textbooks?",
                        answer: "Absolutely not. The concept is to exchange money and the textbook at your local campus. You meet each other without sending anything upfront. If a buyer asks you to ship the textbook, it is up to you if you want to take the risk or not. Student 2 Student does not recommend shipping textbooks."
                    },
                    {
                        question: "Can I sell textbooks to students at other Universities?",
                        answer: "No. Textbooks get traded locally on campus. This provides the hassle-free experience of buying and selling textbooks."
                    },
                    {
                        question: 'What is the "My Sell Page"?',
                        answer: $sce.trustAsHtml("The \"My Sell Page\" is your personalized page on Student 2 Student. This page can be shared with anyone in the internet. It only lists the textbook you are selling right now. This way you can advertise your own textbooks on Facebook or Twitter, where ever you like. The only thing you need to do is share the URL.<br><br>You have your own URL for the Personal Selling Page: <strong>www.student2student.co.uk/[nickname]</strong><br/>(Ex: Nickname is kittoo12. The Page would then be: <strong>www.student2student.co.uk/kittoo12</strong>")
                    }


                ]
            },
            {
                tabId: "tab_4",
                linkText: "buyer's handbook",
                faqs: [
                    {
                        question: "Do I need an account to buy textbooks?",
                        answer: "Not necessarily. You can search, compare and buy textbooks without an account on Student 2 Student. Some sellers may not make the textbook available for non-members. In this case, you will need an account."
                    },
                    {
                        question: "Can I look up pricing from Amazon and other textbook shops?",
                        answer: "We wouldn't be awesome if we didn't help you save money. So the answer is Yes. When you search for a textbook, you will see a comparison that tells you where the textbooks is available for the lowest price. We told you we will save you money!"
                    },
                    {
                        question: "How do I pay for the textbook?",
                        answer: "Textbooks are locally (on-campus) traded and need to be paid when you meet the seller in person. Cash on Exchange (COE) is the concept."
                    },
                    {
                        question: "I can’t find the textbook at my University. What can I do?",
                        answer: "In the rare case where you can't find your textbook locally, we will give you a comparison where to get the textbook the cheapest. Just search for the textbook, and the comparison will come up right away."
                    }

                    ,
                    {
                        question: "Why can't I change the textbook deal after someone contacted me?",
                        answer: "It is not a bug, it is a feature. You cannot change certain values of the deal such as pricing, when the book is available, and textbook usage (notes, highlights) when someone already contacted you. This protects the buyer from sellers changing the price and information after they contacted the seller."
                    }
                    ,
                    {
                        question: "Does the seller see my name and contact information?",
                        answer: "This depends if the seller chose \"Buyer contacts Seller\" or \"Seller contact Buyer\". In the case of \"Seller contacts Buyer\", you will need to provide the information to the seller so he/she can contact you. Otherwise the seller will not see anything else than your Nickname."
                    }
                    ,
                    {
                        question: "What is \"My Watchlist\"?",
                        answer: "The \"My Watchlist\" is a list of all textbooks you are interested in. It only shows the textbooks deals which you contacted the seller by either sending your contact information or by requesting the seller's information."
                    }
                ]
            },
            {
                tabId: "tab_2",
                linkText: "general",
                faqs: [
                    {
                        question: "What is an ISBN?",
                        answer: $sce.trustAsHtml('The International Standard Book Number (ISBN) is a 10-digit number that uniquely identifies books and book-like products published internationally. <a href="http://www.isbn.org/faqs_general_questions">More Information</a>')
                    }
                    ,
                    {
                        question: "What is an EAN?",
                        answer: $sce.trustAsHtml('Every ISBN will consist of thirteen digits in 2007. The thirteen digit number is divided into five parts of variable length, each part separated by a hyphen. Also called ISBN-13. <a href="http://www.isbn.org/faqs_general_questions">More Information</a>')
                    }
                ]

            },
            {
                tabId: "tab_5",
                linkText: "how to's",
                faqs: [
                    {
                        question: "Create an Account",
                        answer: $sce.trustAsHtml('Nothing is easier than creating your personal account on Student 2 Student. Student 2 Student does not require you to enter personal information such as phone number, birthday, etc. You only need a valid Email address. Click on the picture to see an example of how to create an account.<br>' +
                            '<img src="dist/images/faq/signup.png" width="100%"><br/><br/>' +
                            '1. Enter Your Full Name <b>(Ex: Joe Miller)</b><br>' +
                            '2. Enter Your Nickname <b>(Ex: Joe.Miller12)</b>. This is the Name other Users on Student 2 Student will see.<br>' +
                            '3. Enter a valid Email address. <b>(Ex: Joe.Miller12@student2student.co.uk)</b><br>' +
                            ' 4. Enter a strong password. It must be a minimum of 6 characters long.<br>' +
                            '5. This is the most important entry. You have to choose the University Campus where you are going to school.<br>' +
                            'Find the University by typing in the <b>University Name, Location, Stateor University URL</b>. When you start typing in the letters, the system will pull a list of' +
                            'Universities that already exists on Student 2 Student. Choose your University.<br>' +
                            '<b>(Ex: Typed in Osh and chose University of Wisconsin Oshkosh, Oshkosh (WI), United States)</b></<br>' +
                            '6. Tell us how you found out about Student 2 Student. <b>(Ex: Facebook)</b><br>' +
                            '7. Complete the captcha<br><br>' +


                            'Click on \"Create My Account\" to finish the process. The last thing you have to do is activate your account. Go to the email account you entered and click on the link in the verification email we sent you.<br>' +

                            '<br>You are all done and ready to buy, sell and save!')
                    },
                    {
                        question: "Reset my Password",
                        answer: $sce.trustAsHtml('Did you forget your password? Absolutely no problem.'+
                        'You can reset your password on the "Sign In - Forgot the Password" page or by <a href="http://www.student2student.co.uk/forgotPassword">Clicking here</a>.<br/><br/>'+

                            '<img src="dist/images/faq/forgotPassword.png" width="100%"><br/><br/>' +

                    '1. Enter the email address you used when you registered your account. <b>(Ex: joe.miller12@student2student.co.uk)</b><br/>'+

        '2. You will receive an email with the link to reset your password. Be aware that the link only works for a short period of time. Follow the link to Student 2 Student to reset your password.<br/><br/>'+

                            '<img src="dist/images/faq/resetPassword.png" width="100%"><br/><br/>' +


        '3. Set your New Password.<br/>' +
                            '<br><b>All Done! Use your New Password from now on.</b>')
                    }
                ]
            },
            {
                tabId: "tab_6",
                linkText: "policies",
                faqs: [
                    {
                        question: "Privacy",
                        answer: $sce.trustAsHtml('Read our Privacy Policy <a href="http://www.student2student.co.uk/privacyPolicy">here</a>')
                    },
                    {
                        question: "Disclaimer",
                        answer: $sce.trustAsHtml('Read Disclaimer <a href="http://www.student2student.co.uk/disclaimer">here</a>')
                    },
                    {
                        question: "Condition of Use",
                        answer: $sce.trustAsHtml('Read Condition of Use <a href="http://www.student2student.co.uk/conditionOfUse">here</a>')
                    }
                ]
            },
            {
                tabId: "tab_7",
                linkText: "contact us",
                faqs: [
                    {
                        question: "Still have questions?",
                        answer: $sce.trustAsHtml('You still have questions? Contact us <a href="http://www.student2student.co.uk/contactUs">here</a>')
                    }
                ]
            }
        ];

        $scope.active = _active;

        function _active(faq) {
            angular.forEach($scope.faqList, function (faqL) {
                faqL.active = false;
            });
            faq.active = true;
        }


        function _downloadBookmarkForPrint(){
            var downloadLink = angular.element('<a></a>');
            var path = SERVER_CONSTANT.IMAGE_HOST_PATH+"/assets/images/bookmark_for_print.png";
            downloadLink.attr('href',path);
            downloadLink.attr('download', 'BookmarkForPrint.png');
            downloadLink[0].click();
        }
    }


})();


