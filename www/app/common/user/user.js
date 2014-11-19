/**
* sip.common.user Module
*
* Description
*/
angular.module('sip.common.user', [])
  .factory('User', function($mdBottomSheet, $q, $state, $dispatcher, $rootScope, CONFIG) {
    var channel;
    var User = {
      on: function(action, val) {
        console.log(action, val.name);
        if (action === 'updated') {
          $rootScope.user = val;
        }
      }
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

    return User;
  });
