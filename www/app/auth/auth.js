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
  .controller('AuthCtrl', function($scope, $state, $actions, $dispatcher, Auth){
    // angular.extend(this, User);
    this.signIn = function() {
      Auth.signin()
      .then(function(user) {
        $dispatcher.kickstart(user);
        $actions.updateMe(user);
        $state.go('sip.main.drinks.list');
      })
      .catch(function(err) {
        console.log(err);
      });
    };
  })
  .factory('Auth', function(localStorageService, jwtHelper, $actions, $q) {
    var signin = function() {
      var defer = $q.defer();
      auth.signin({
        popup: true,
        // Make the widget non closeable
        standalone: true,
        // This asks for the refresh token
        // So that the user never has to log in again
        authParams: {
          scope: 'openid offline_access'
        }
      }, function(profile, idToken, accessToken, state, refreshToken) {
        localStorageService.set('profile', profile);
        localStorageService.set('token', idToken);
        localStorageService.set('refreshToken', refreshToken);
        defer.resolve(profile);
        // $state.go('sip.main.bars.list');
      }, function(error) {
        defer.reject(error);
        console.log("There was an error logging in", error);
      });
      return defer.promise;
    };

    return {
      signin: signin
    };
  });
