/**
* sip.common.streams Module
*
* Core PubNub service
*/
angular.module('sip.common.flux', [
  'sip.main.flux.mixins'
])
  .factory('$actions', function(flux) {
    return flux.actions([
     'receiveUser',
     'receiveBars'
    ]);
  })
  .factory('$store', function(flux, $actions, $dispatcher, localStorageService, $log, BarMixin, UserMixin) {

    return flux.store({
      mixin: [BarMixin, UserMixin]
    });

  })
  .factory('$dispatcher', function(PubNub, $rootScope, $log, CONFIG, $actions, $rootScope){
    var _alias = CONFIG.alias;

    var _pnCb = function(message) {
      if (message.to === _alias) {
        $log.log('for mobile!!');
        _.forEach(message.actions, function(args, action) {
          $actions[action](args);
        });
      }
    };

    var pbFlux = {
      kickstart: function(user) {
        /*
          @auth - auth key created by server for each user
                  upon authentication.
        */

        PubNub.init({
          publish_key: 'pub-c-e7567c4a-b42c-4a6d-af64-b9e6db79424d',
          subscribe_key: 'sub-c-e72ce3bc-6960-11e4-8e76-02ee2ddab7fe',
          auth_key: user.auth_key,
          restore: true
        });

        PubNub.ngSubscribe({ channel: user.private_channel });
        $rootScope.$on(PubNub.ngMsgEv(user.private_channel), function(e, message) {
          console.log('in history');
          if (message.to === _alias) {
            _.forEach(message.actions, function(args, action) {
              $actions[action](args);
            });
          }
        });

        PubNub.ngHistory({ channel: user.private_channel, count: 1 });
        $log.log('kickstart');
      },

      sub: function(channel) {
        PubNub.ngSubscribe({
          channel: channel,
          callback: _pnCb,
          error: function(e) {
            console.error(e);
          }
        });
      },

      pub: function(message, channel) {
        message.from = _alias;
        message.to = 'API';

        PubNub.ngPublish({
          channel: channel,
          message: message,
          callback: function() {
            $log.log('pubbed');
          }
        });
      }
    };

    return pbFlux;
  });
