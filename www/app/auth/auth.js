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
  .controller('AuthCtrl', function($scope, $state, UserFactory){
    angular.extend(this, UserFactory);
    this.auth = function() {
      UserFactory.signIn().then(function(profile) {
        UserFactory.user = profile;
        console.log('got profile', profile);
        $state.go('sip.main.bars.list');
      })
      .catch(function(error) {
        console.error(error);
      });
    };
  });
