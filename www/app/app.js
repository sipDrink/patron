// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sip', [
  'ionic', 'ngMaterial',
  'sip.auth', 'sip.common',
  'sip.main', 'ngCordova',
  'pubnub.angular.service',
  'ngResource', 'angular-jwt',
  'LocalStorageModule', 'flux',
  'auth0'
])

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider, $ionicConfigProvider, authProvider) {
  $httpProvider.interceptors.push('jwtInterceptor');

  $urlRouterProvider.otherwise('/main/bars/list');
  $stateProvider
    .state('sip', {
      abstract: true,
      url: '',
      templateUrl: 'app/app.tpl.html',
      controller: 'AppController as app'
    });

  localStorageServiceProvider
    .setPrefix('sip');

  $ionicConfigProvider.views.maxCache(10)
    .transition('android');

  authProvider.init({
    domain: 'sadf.auth0.com',
    clientID: 'mKM91tCQWyj8WyqI0oxaSp3B3aP23A4b',
    loginState: 'sip.auth'
  });

})
.controller('AppController', function($store, $scope, $log) {
  $store.bindTo($scope, function() {
    $log.log('updated in app');
    this.user = $store.getUser();
  }.bind(this));

})
.run(function($ionicPlatform, $rootScope, $state, $cordovaStatusbar, Auth, User, auth, localStorageService, jwtHelper) {
  auth.hookEvents();
  // $rootScope.$on('$stateChangeStart', function(e, toState, toStateParams, fromState) {
  //   Auth.isSignedin(function(signedIn) {
  //     if (toState.authenticate && !signedIn) {
  //       e.preventDefault();
  //       $state.go('sip.auth');
  //     }
  //   });
  // });

  if (!auth.isAuthenticated) {
    var token = localStorageService.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        auth.authenticate(localStorageService.get('profile'), token);
      } else {
        // Either show Login page or use the refresh token to get a new idToken

        $state.go('sip.auth');
      }
    }
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
      // $cordovaStatusbar.overlaysWebView(true);

      // $cordovaStatusbar.styleHex('#004D40');

      // $cordovaStatusbar.show();
    }
  });
})
.factory('jwtInterceptor', function(localStorageService) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      var token = localStorageService.get('user');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  };
});
