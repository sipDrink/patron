/**
* sip.auth Module
*
* Auth module
*/
angular.module('sip.auth', [])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.auth', {
        url: '/auth',
        templateUrl: 'app/auth/auth.tpl.html',
        controller: 'AuthCtrl as auth'
      });
  })
  .controller('AuthCtrl', function($scope, UserFactory){
    angular.extend(this, UserFactory);
  });
