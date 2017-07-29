'use strict';
angular.module('SAAPP')

    // start of IndexController ------- 
    // -----------------
    //
    .controller('IndexController', ['$scope', '$location', '$http', '$rootScope', function ($scope, $location, $http, $rootScope) {

        $scope.IsActive = function (destination) {
            return destination === $location.path();
        }
        $scope.logout = function () {
            $http.post('/users/logout')
                .success(function () {
                    $rootScope.currentUser = null;
                    $location.path('/');
                });
        };
    }])
        // start of MarketController ------- 
    // -----------------
    //
    .controller('MarketController', ['$scope', '$location', '$http', '$rootScope', function ($scope, $location, $http, $rootScope) {
        if ($rootScope.currentUser == null) {
            $location.path('/users/login');
        };
    }])
            // start of ProfileController ------- 
    // -----------------
    //
    .controller('ProfileController', ['$scope', '$location', '$http', '$rootScope', function ($scope, $location, $http, $rootScope) {
        if ($rootScope.currentUser == null) {
            $location.path('/users/login');
        };
        $scope.passwordData = {
            username: "",
            password1: "",
            password2: ""
        };
        $scope.passwordData.username = $rootScope.currentUser;
        $scope.passwordChangeSuccess = false;
        $scope.errorMessageToggle = false;
        $scope.errorMessage = "";
        $scope.sendPasswordChange = function () {
            console.log($scope.passwordData);
            $http.post('/users/passwordchange', $scope.passwordData)
               .success(function (response) {
                   $scope.passwordChangeSuccess = true;
                   $scope.passwordData.password1 = "";
                   $scope.passwordData.password2 = "";
                   $scope.PasswordChangeForm.$setPristine();
               })
               .error(function (error) {
                   $scope.errorMessageToggle = true;
                   $scope.errorMessage = error;
               });
        };
    }])
        // start of RegisterController ------- 
    // -----------------
    //
    .controller('RegisterController', ['$scope', '$http', 'codeGenerationService', '$location', '$timeout', function ($scope, $http, codeGenerationService, $location, $timeout) {

        $scope.registerData = {
            username: "",
            password: "",
            emailid: "",
            firstname: "",
            lastname: "",
            generatedRegistrationCode: ""

        };

        $scope.yourRegistrationWasSent = false;
        $scope.RegistrationCodeInput = "";
        $scope.errorMessageToggle = false;
        $scope.errorMessage = "";
        $scope.yourRegistrationComplete = false;
        $scope.showSpinner = false;

        var lapseTimer = function () {
            $scope.yourRegistrationComplete = false;
            $location.path('/users/login');
        };

        $scope.sendRegistrationeMail = function () {
            $scope.showSpinner = true;
            console.log($scope.showSpinner);
            $scope.registerData.generatedRegistrationCode = codeGenerationService.codeGen();
            console.log($scope.registerData);
            // generate $scope.entryRegistrationCode
            // send email 
            $http.post('/users/mailer', $scope.registerData)
                   .success(function (response) {
                       console.log('Registration Code Message Sent');
                       $scope.yourRegistrationWasSent = true;
                   })
                   .error(function (error) {
                       $scope.errorMessageToggle = true;
                       $scope.errorMessage = error;
                   })
                    .finally(function () {
                        $scope.showSpinner = false;
                    });
        };
        $scope.sendRegistrationCode = function () {
            if ($scope.RegistrationCodeInput === $scope.registerData.generatedRegistrationCode) {
                $http.post('/users/register', $scope.registerData)
                        .success(function (user) {
                            console.log(user);
                            $scope.yourRegistrationComplete = true;
                            $timeout(lapseTimer, 5000);
                        })
                        .error(function (error) {
                            $scope.errorMessageToggle = true;
                            $scope.errorMessage = error;
                        });
            } else {
                $scope.errorMessageToggle = true;
                $scope.errorMessage = "Please Enter correct Registration code";
            }
        };
        $scope.resendEmail = function () {
            $http.post('/users/mailer', $scope.registerData)
                .success(function (response) {
                    console.log('Registration Code Message re-Sent');
                })
                .error(function (error) {
                    $scope.errorMessageToggle = true;
                    $scope.errorMessage = error;
                });
        };

    }])
    // start of LoginController ------- 
    // -----------------
    //
    .controller('LoginController', ['$scope', '$http', 'codeGenerationService', '$rootScope', '$location', function ($scope, $http, codeGenerationService, $rootScope, $location)
    {
        $scope.youForgetPassword = false;
        $scope.youForgetPasswordDisable = false;
        $scope.loginData =
            {
                        username: "",
                        password: ""
            };
        $scope.forgetPasswordData =
            {
                        emailid: "",
                        emailidconfirm: "",
                        generatedPasswordCode: ""
            };
        $scope.passwordData = {
            emailid: "",
            password1: "",
            password2: ""
        };
        $scope.keepmein = false;
        $scope.errorMessageToggle = false;
        $scope.errorMessage = "";
        $scope.yourCodeWasSent = false;
        $scope.passwordCodeInput = "";
        $scope.showPasswordChange = false;
        $scope.yourPasswordResetComplete = false;
        $scope.showSpinner = false;

        $scope.sendLogin = function ()
        {
            console.log($scope.loginData);
            $http.post('/users/login', $scope.loginData)
                    .success(function (response)
                            {
                                $rootScope.currentUser = $scope.loginData.username;
                                console.log(response);
                                $location.path('/market');
                            })
                    .error(function (error)
                            {
                                $scope.errorMessageToggle = true;
                                $scope.errorMessage = "User Name Password not Correct";
                            });
        };
        $scope.forgetPassword = function () {
            $scope.youForgetPassword = true;
            $scope.youForgetPasswordDisable = true;
        };

        $scope.sendEmailId = function () {
            // send email for the forget password code and 
            // allow entry of code
            $scope.showSpinner = true;
            $scope.forgetPasswordData.generatedPasswordCode = codeGenerationService.codeGen();
            console.log($scope.forgetPasswordData);
            // generate $scope.generatedRegistrationCode
            // send email 
            $http.post('/users/passwordcodemailer', $scope.forgetPasswordData)
                   .success(function (response) {
                       console.log('Forget Password Code Message Sent');
                       $scope.youForgetPassword = false;
                       $scope.yourCodeWasSent = true;
                   })
                   .error(function (error) {
                       $scope.errorMessageToggle = true;
                       $scope.errorMessage = error;
                   })
                    .finally(function () {
                        $scope.showSpinner = false;
                    });
        };
        $scope.sendForgetPasswordCode = function () {
            // send forget password code then allow or not allow access to reset password
            if ($scope.forgetPasswordData.generatedPasswordCode === $scope.passwordCodeInput) 
            {
                $scope.yourCodeWasSent = false;
                $scope.showPasswordChange = true;
            } else {
                $scope.errorMessageToggle = true;
                $scope.errorMessage = "Please Enter correct Password Forget code";
            }

        };

        $scope.resendEmail = function () {
            $http.post('/users/passwordcodemailer', $scope.forgetPasswordData)
                .success(function (response) {
                    console.log('Forget Password Code Message re-Sent');
                })
                .error(function (error) {
                    $scope.errorMessageToggle = true;
                    $scope.errorMessage = error;
                });
        };
        $scope.sendPasswordChange = function () {
            $scope.passwordData.emailid = $scope.forgetPasswordData.emailid;
            console.log($scope.passwordData);
            $http.post('/users/passwordreset', $scope.passwordData)
               .success(function (response) {
                   $scope.yourPasswordResetComplete = true;
                   $scope.youForgetPasswordDisable = false;
                   $scope.showPasswordChange = false;
               })
               .error(function (error) {
                   $scope.errorMessageToggle = true;
                   $scope.errorMessage = error;
               });
        };
    }])
    //
    // start of contactController ------- 
    // -----------------
    //
    .controller('ContactController', ['$scope', '$http', function($scope, $http) { 
            
        $scope.contactSupport = {  firstname: "", 
                            lastname: "", 
                            phone: {
                                countrycode:"",
                                telnum:""
                            }, 
                            emailid:"",
                            priority: 3,
                            subject: "",
                            message: ""
        };
        
        var subjects = [
                        {value:"Technical Issue", label:"Technical Issue"},
                        {value:"Course Registration",label:"Course Registration"},
                        {value:"Others",label:"Others"}
                        ];
        
        $scope.subjects = subjects;
        
        $http.get('/countryPhoneCodes.json').success(function(phoneCodes) {
           $scope.phoneCodes = phoneCodes.countries;
        });
        
        $scope.countryCodeNotSelected = false;
        $scope.subjectNotSelected = false;
        $scope.CAPTCHANOTPASS = false;
        $scope.yourMessageWasSent = false;
        $scope.errorMessageToggle = false;
        $scope.errorMessage = "";
        
        $scope.sendMessage = function() {
            if ($scope.contactSupport.phone.countrycode === "") {
                $scope.countryCodeNotSelected = true;
                return;
            } else {
                $scope.countryCodeNotSelected = false;
            }
            if ($scope.contactSupport.subject === "") {
                $scope.subjectNotSelected = true;
                return;
            } else {
                $scope.subjectNotSelected = false;
            }
            //
            // CAPTCHA pass false is pass 
            //
            if(grecaptcha.getResponse().length === 0)
            {
                $scope.CAPTCHANOTPASS = true;
                return; 
            }
            else
            {
                $scope.CAPTCHANOTPASS = false;
            }
            //
            // send email to support
            //
            $http.post('/contact', $scope.contactSupport)
                    .success(function (response) {
                            $scope.yourMessageWasSent = true;
                            $scope.contactSupport = {
                                firstname: "",
                                lastname: "",
                                phone: {
                                    countrycode: "",
                                    telnum: ""
                                },
                                emailid: "",
                                priority: 3,
                                subject: "",
                                message: ""
                            };
                            $scope.contactSupportForm.$setPristine();
                    })
                    .error(function (error) {
                        $scope.errorMessageToggle = true;
                        $scope.errorMessage = error;
                    })
            ;
        };
    }])
    // end of contactController ------------------
    // -----------------
;