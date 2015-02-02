// **sip** module. Main entry module. All app modules
// will be fed here
angular.module('sip', [
  'ionic', 'ngMaterial',
  'sip.auth', 'sip.common',
  'sip.main', 'ngCordova',
  'pubnub.angular.service',
   'angular-jwt','LocalStorageModule',
   'flux', 'auth0',
   'ngGeodist'
])

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider, $ionicConfigProvider, authProvider, $mdThemingProvider) {
  // $httpProvider.interceptors.push('jwtInterceptor');
  $mdThemingProvider.theme('default')
    .primaryColor('teal')
    .accentColor('red');

  $urlRouterProvider.otherwise('/main/bars/list');
  $stateProvider
    .state('sip', {
      // abstract means you can't navigate to this state,
      // its just a means for organizing not presentation
      abstract: true,
      url: '',

      template: '<ion-nav-view></ion-nav-view>',
      // controllerAs syntax, we will now be able to use the
      // 'app' controller in the html
      controller: 'AppController as app'
    });


  localStorageServiceProvider
    .setPrefix('sip');

  // As of Ionic Beta 14, you can canche views, set the limit
  // here. You can also choose what transition animation you'd like
  $ionicConfigProvider.views.maxCache(5);
  $ionicConfigProvider.views.transition('android');

  authProvider.init({
    domain: 'sipdrink.auth0.com',
    clientID: 'mYLZ1owVTysjstR9o6PvdHT7Kqvj5Qa9',
    loginState: 'sip.auth'
  });

})
.controller('AppController', function($store, $scope, $log, Auth, $mdSidenav, $state) {
  $store.bindTo($scope, function() {
    this.user = $store.getUser();
  }.bind(this));
})
.run(function($ionicPlatform, $cordovaSplashscreen, $rootScope, $state, $cordovaStatusbar, Auth, User, auth, localStorageService, jwtHelper) {
  auth.hookEvents();

  setTimeout(function(){
    $cordovaSplashscreen.hide();
  }, 2000);

  if (!auth.isAuthenticated) {
    var token = localStorageService.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {

        auth.authenticate(localStorageService.get('profile'), token);
      } else {
        // Either show Login page or use the refresh token to get a new idToken
        console.log('expired?');
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
