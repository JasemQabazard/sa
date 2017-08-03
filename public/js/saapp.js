'use strict';
angular
    .module('SAAPP', [
        'ui.router', 'validation.match'
    ])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

        $stateProvider
            .state('saapp', {
                url: '/',
                views: {
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'IndexController'
                    }
                }
            })
            .state('saapp.about', {
                url: 'about',
                views: {
                    'content@': {
                        templateUrl: 'views/about.html'
                    }
                }
            })
            .state('saapp.blog', {
                url: 'blog',
                views: {
                    'content@': {
                        templateUrl:'views/blog.html'
                    }
                }
            })
            .state('saapp.market', {
                url: 'market',
                views: {
                    'content@': {
                        templateUrl: 'views/market.html'
                    }
                }
            })
            .state('saapp.contact', {
                url: 'contact',
                views: {
                    'content@': {
                        templateUrl: 'views/contact.html',
                        controller: 'ContactController'
                    }
                }
            })
            .state('saapp.register', {
                url: 'users/register',
                views: {
                    'content@': {
                        templateUrl: 'views/security/register.html',
                        controller: 'RegisterController'
                    }
                }
            })
            .state('saapp.login', {
                url: 'users/login',
                views: {
                    'content@': {
                        templateUrl: 'views/security/login.html',
                        controller: 'LoginController'
                    }
                }
            })
            .state('saapp.profile', {
                url: 'users/profile',
                views: {
                    'content@': {
                        templateUrl: 'views/security/profile.html',
                        controller: 'ProfileController'
                    }
                }
            })
            .state('saapp.logout', {
                url: 'users/logout',
                views: {
                    'content@': {
                        templateUrl: 'views/home.html',
                        controller: 'IndexController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    }])
;