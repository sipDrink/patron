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
  'LocalStorageModule'
])

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider) {
  $httpProvider.interceptors.push('jwtInterceptor');

  $urlRouterProvider.otherwise('/main/bars/list');
  $stateProvider
    .state('sip', {
      abstract: true,
      url: '',
      templateUrl: 'app/app.tpl.html'
    });

  localStorageServiceProvider
    .setPrefix('sip');

})
.run(function($ionicPlatform, $rootScope, $state, $cordovaStatusbar, Auth) {
  $rootScope.$on('$stateChangeStart', function(e, toState, toStateParams, fromState) {
    Auth.isSignedin(function(signedIn) {
      if (toState.authenticate && !signedIn) {
        console.log('nooope');
        e.preventDefault();
        $state.go('sip.auth');
      }
    });
  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      console.log('status bar');
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
