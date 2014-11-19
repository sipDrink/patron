/**
* sip.common.streams Module
*
* Core PubNub service
*/
angular.module('sip.common.streams', [])
  .factory('$actions', function(flux) {
    return flux.actions([
      'updateMe',
      'updateBars',
    ]);
  })
  .factory('$store', function(flux, $actions, $dispatcher) {

    return flux.store({
      user: {},
      bars: {},
      actions: _.map($actions, function(action){return action;}),
      updateMe: function(user) {
        console.log('user', user);
        _.extend(this.user, user);
        this.emitChange();
      },
      updateBars: function(bars) {
        _.extend(this.bars, bars);
        this.emitChange();
      },
      exports: {
        getBars: function() {
          $dispatcher.pub({
            actions: {
              'get': { what: 'Bar' }
            }
          });
        },

        getMe: function() {
          return $dispatcher.pub({
            actions: {
              'get': { what: 'me' }
            }
          });
        }
      }
    });

  })
  .factory('$dispatcher', function(PubNub, $rootScope, $log, CONFIG, $actions){
    var _mainChannel;
    var _alias = CONFIG.alias;

    var _pnCb = function(message) {
      console.log('got message', message);
      message = message[0];

      if (message.to === _alias) {
        _.forEach(message.actions, function(args, action) {
          actions[action](args);
        });
      }
    };

    var pbFlux = {
      kickstart: function(channel, auth) {
        /*
          @auth - auth key created by server for each user
                  upon authentication.
        */
        _mainChannel = channel;

        PubNub.init({
          publish_key: 'pub-c-e7567c4a-b42c-4a6d-af64-b9e6db79424d',
          subscribe_key: 'sub-c-e72ce3bc-6960-11e4-8e76-02ee2ddab7fe',
          auth_key: auth
        });
        console.log('is sub?', _mainChannel);
        pbFlux.sub(_mainChannel);
      },

      sub: function(channel) {
        channel = channel || _mainChannel;
        PubNub.ngSubscribe({
          channel: channel,
          message: _pnCb,
          callback: function() {
            console.log('subbed to ' + channel);
          }
        });
      },

      pub: function(message, config) {
        message.from = _alias;
        message.to = 'API';

        PubNub.ngPublish({
          channel: _mainChannel,
          message: message,
          callback: function() {
            console.log('pubbed', message.actions);
          }
        });
      }
    };

    return pbFlux;
  });
