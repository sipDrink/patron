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
  'LocalStorageModule', 'flux'
])

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider, $ionicConfigProvider) {
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

})
.controller('AppController', function($store, $scope, $log) {
  $store.bindTo($scope, function() {
    $log.log('updated in app');
    this.user = $store.getUser();
  }.bind(this));

  this.newUser = function() {
    $store.getNewMe();
  };
  this.updateName = function() {
    $store.updateUser('Hendrix');
  };
})
.run(function($ionicPlatform, $rootScope, $state, $cordovaStatusbar, Auth, User) {

  $rootScope.$on('$stateChangeStart', function(e, toState, toStateParams, fromState) {
    Auth.isSignedin(function(signedIn) {
      if (toState.authenticate && !signedIn) {
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
