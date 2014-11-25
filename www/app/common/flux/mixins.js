/**
* sip.common.flux.mixins Module
*
* Store and Action mixins for resources
*/
angular.module('sip.common.flux.mixins', [])
  .factory('UserMixin', function($actions, $dispatcher, $log, localStorageService) {
    // Mixin for user actions and state
    var UserMixin = {
      actions: [
        actions.receiveUser
      ],
      user: localStorageService.get('profile') || {},

      receiveUser: function(nUser) {
        _.extend(this.user, nUser);
        localStorageService.set('profile', this.user);
        this.emitChange();
      },


      exports: {
        getUser: function() {
          var id = this.user._id;

          $dispatcher.pup({
            actions: {
              'getOne': {
                _id: id
              }
            },
            respondTo: {
              action: 'receiveUser'
            }
          }, 'users');
        }
      }
    };

    return UserMixin;
  })
  .factory('BarMixin', function($actions, $dispatcher) {
    var BarMixin = {

      actions: [
        actions.receiveBars
      ],

      bars: [],

      receiveBars: function(bars) {
        this.bars = bars;
        this.emitChange();
      },

      exports: {
        getBars: function(options) {
          $dispatcher.pub({
            actions: {
              'get': {
                query: options.query,
                options: options.extra || {}
              }
            },
            respondTo: {
              action: 'receiveBars',
              channel: ''
            }
          }, 'bars');
        }
      }
    };
  });
