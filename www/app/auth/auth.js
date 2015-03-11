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
  .controller('AuthCtrl', function($scope, $state, $actions, $dispatcher, $log, Auth){
    // angular.extend(this, User);
    this.signIn = function() {
      console.log('sign in function called');
      Auth.signin()
      .then(function(user) {
        console.log('gets to then');
        $dispatcher.kickstart(user);
        console.log('after kickstart');
        $actions.updateMe(user);
        console.log('after updateMe');
        $state.go('sip.main.bars.list');
      })
      .catch(function(err) {
        $log.error(err);
      });
    };
  })
  .factory('Auth', function(localStorageService, jwtHelper, $ionicHistory, $actions, $q, $state, auth, $log, $mdSidenav) {
    var signin = function() {
      console.log('runs in factory');
      var defer = $q.defer();
      console.log('defer not broken');
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
        console.log('auth.signin gets to callback')
        localStorageService.set('token', idToken);
        console.log('sets token');
        localStorageService.set('refreshToken', refreshToken);
        console.log('refreshToken set')
        if (!profile.auth_key) {
          profile.auth_key = profile.identities[0].access_token;
          $log.log('auth_key', profile.auth_key);
        }

        $log.log('CHANNEL', profile.private_channel);
        localStorageService.set('profile', profile);
        $actions.receiveUser(profile);
        defer.resolve(profile);
        // $state.go('sip.main.bars.list');
      }, function(error) {
        defer.reject(error);
        $log.error("There was an error logging in", error);
      });
      return defer.promise;
    };

    var signout = function() {
      auth.signout();
      $actions.reset();
      localStorageService.remove('profile');
      localStorageService.remove('token');
      localStorageService.remove('refreshToken');
      // $mdSidenav('left').close();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('sip.auth');
    };
    return {
      signin: signin,
      signout: signout
    };
  });
