/**
* sip.common.user Module
*
* Description
*/
angular.module('sip.common.user', [])
  .factory('User', function($mdBottomSheet, $q, $state, $dispatcher, $rootScope, CONFIG, auth, localStorageService) {
    // var signIn = function() {
    //   var defer = $q.defer();
    //   auth.signin({
    //     popup: true,
    //     // Make the widget non closeable
    //     standalone: true,
    //     // This asks for the refresh token
    //     // So that the user never has to log in again
    //     authParams: {
    //       scope: 'openid offline_access'
    //     }
    //   }, function(profile, idToken, accessToken, state, refreshToken) {
    //     localStorageService.set('profile', profile);
    //     localStorageService.set('token', idToken);
    //     localStorageService.set('refreshToken', refreshToken);
    //     defer.resolve(profile);
    //     // $state.go('sip.main.bars.list');
    //   }, function(error) {
    //     defer.reject(error);
    //     console.log("There was an error logging in", error);
    //   });
    //   return defer.promise;
    // };

    var channel;
    var User = {
    };

    User.initStreams = function(user) {
      console.log('init');

      channel = 'private-'+user._id;

      $dispatcher.init(user.auth_key);

      // $dispatcher.pub({
      //   channel: channel,
      //   message: {data: 'give me data'},
      //   error: function(e){
      //     console.error(e)
      //   },
      //   callback: function(){
      //     console.log('pubbed!!');
      //   }
      // });

      $dispatcher.sub({
        channel: channel,
        message: function(message){
          console.log(message[0]);
          message = message[0];
          if (message.to === CONFIG.alias) {
            console.log(message);
            _.forEach(message.actions, function(vals, action) {
              User.on(action, vals);
            });
          }
        },
        callback: function() {
          console.log('subscribed');
        }
      });

      User.update();
    };

    User.update = function(values) {
      console.log('updating');
      var user = angular.copy($rootScope.user);
      user.name = "Very Often";
      $dispatcher.pub({
        channel: channel,
        message: {
          to: 'API',
          actions: {
            'update': user
          }
        }
      });
    };
    // User.signIn = signIn;
    return User;
  });
