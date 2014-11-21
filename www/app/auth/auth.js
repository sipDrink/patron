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
  .controller('AuthCtrl', function($scope, User, Auth){
    angular.extend(this, User, Auth);
  })
  .factory('Auth', function($dispatcher, $http, $window, $ionicLoading, localStorageService, URLS, $state, jwtHelper, $actions) {
    var user = {};

    var signin = function(provider){

      var parseToken = function(url) {
        var token = url.split('token=')[1];

        if (token.indexOf('#_=_') > -1) {
          token = token.split('#_=_')[0];
        }

        localStorageService.set('user', token);
        return token;
      };

      var finishUp = function(ref) {
        ref.close();
        $ionicLoading.hide();
        $state.go('sip.main.bars.list');
      };

      var url = URLS[provider];
      var popUpWindow = $window.open(url, '_blank', 'location=no,toolbar=no,hidden=yes');

      $ionicLoading.show({
        template: '<i class="icon ion-loading-b"></>'
      });

      popUpWindow.addEventListener('loadstart', function(e) {
        var url = e.url;

        if (/auth\?token=/.test(url)) {
          var token = parseToken(url);
          user = jwtHelper.decodeToken(token).user;
          $actions.updateMe(user);
          $dispatcher.kickstart('private-' + user._id, user.auth_key);
          finishUp(popUpWindow);
        }

      });

      popUpWindow.addEventListener('loadstop', function(e){
        popUpWindow.show();
      });

    };

    var isSignedin = function(cb) {
      cb(!!getUserToken());
    };

    var getUserToken = function() {
      return localStorageService.get('user');
    };

    var signOut = function() {
      localStorageService.remove('user');
      // $state.go('sip.auth');
    };

    var restart = function() {
      if (!!getUserToken()) {
        user = jwtHelper.decodeToken(getUserToken()).user;
        $actions.updateMe(user);
        $dispatcher.kickstart('private-' + user._id, user.auth_key);
      }
    };

    return {
      signIn: signin,
      isSignedin: isSignedin,
      getUserToken: getUserToken,
      signout: signOut,
      restart: restart
    };
  });
