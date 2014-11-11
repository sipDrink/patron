// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sip', [
  'ionic', 'ngMaterial',
  'sip.auth', 'sip.common',
  'sip.main','auth0',
  'angular-storage',
  'angular-jwt',
  'pubnub.angular.service'
])

.config(function($stateProvider, $urlRouterProvider, authProvider) {
  $urlRouterProvider.otherwise('/main/bars/list');
  $stateProvider
    .state('sip', {
      abstract: true,
      url: '',
      templateUrl: 'app/app.tpl.html'
    });

  authProvider.init({
    domain: 'sadf.auth0.com',
    clientID: 'mKM91tCQWyj8WyqI0oxaSp3B3aP23A4b',
    callbackURL: location.href,
    loginState: 'sip.auth'
  });

})
.run(function($ionicPlatform, $rootScope, $state, store, jwtHelper, auth) {
  auth.hookEvents();

  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          // Either show Login page or use the refresh token to get a new idToken
          $state.go('sip.auth');
        }
      }
    }
  });
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
