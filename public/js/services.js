'use strict';
angular.module('SAAPP')
    .service('codeGenerationService', function () {
        this.codeGen = function () {
            var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var randomCode = '';
            for (var i = 0; i < 6; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomCode += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomCode;
        };
    })
;