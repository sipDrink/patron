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
  .factory('Auth', function(PB, $http, $window, $ionicLoading, localStorageService, URLS, $state, User, jwtHelper) {
    var currentUser = {};

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
        console.log('finishing up');
        PB.pub({
          channel: 'global-grant',
          message: {token: 'token-2938hrhfkhfiwryh'}
        });
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
          currentUser = jwtHelper.decodeToken(token).user;
          // User.initStreams(currentUser);
          finishUp(popUpWindow);
        }

      });

      popUpWindow.addEventListener('loadstop', function(e){
        popUpWindow.show();
      });
    };

    var isSignedin = function(cb) {
      if(currentUser.hasOwnProperty('$promise')) {
        currentUser.$promise.then(function(user) {
          cb(true);
        })
        .catch(function() {
          cb(false);
        });
      } else if (currentUser.hasOwnProperty('_id')){
        cb(true);
      } else {
        cb(false);
      }
    };

    var getCurrentUser = function() {
      return currentUser;
    };

    var getUserToken = function() {
      return localStorageService.get('user');
    };

    if (!!getUserToken()) {
      currentUser = jwtHelper.decodeToken(getUserToken()).user;
    }

    return {
      signIn: signin,
      isSignedin: isSignedin,
      getCurrentUser: getCurrentUser,
      getUserToken: getUserToken
    };
  });
