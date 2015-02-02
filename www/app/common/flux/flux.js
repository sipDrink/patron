/**
* sip.common.streams Module
*
* Core PubNub service
*/
angular.module('sip.common.flux', [
  'sip.common.flux.mixins'
])
  .factory('$actions', function(flux) {
    return flux.actions([
     'receiveUser',
     'receiveBars',
     'reset',
     'updateCart',
     'sendOrder',
     'receiveOrderUpdate'
    ]);
  })
  .factory('$store', function(flux, $actions, $dispatcher, localStorageService, $log, ngGeodist, $filter) {

    return flux.store({
      actions: [
        $actions.receiveUser,
        $actions.receiveBars,
        $actions.reset,
        $actions.updateCart,
        $actions.sendOrder,
        $actions.receiveOrderUpdate
      ],

      user: localStorageService.get('profile') || {},
      bars: [],
      carts: {},
      orders: {},

      receiveUser: function(nUser) {
        $log.log('incoming user')
        _.extend(this.user, nUser);
        localStorageService.set('profile', this.user);
        this.emitChange();
      },

      receiveBars: function(bars) {
        this.bars = _.map(bars, function(bar) {
          bar.distance = ngGeodist.getDistance(this.user.coords, bar.loc, { format: true });
          return bar;
        }.bind(this));
        $log.log(this.bars[0]);
        this.emitChange();
      },

      reset: function() {
        this.bars = [];
        this.user = {};
        this.carts = {};
        this.orders = {};
        // this.emitChange();
      },

      updateCart: function(barId, item, drinkname, clean) {
        if (clean) {
          this.carts[barId] = null;
          this.emitChange();

          return;
        }
        var cart = this.carts[barId];
        if (drinkname) {
          // remove form cart
          cart.splice(_.findIndex(cart, { name: drinkname }), 1);
        } else if (!cart) {
          this.carts[barId] = [item];
        } else {
          if (item){
            cart.push(item);
          }
        }
        this.emitChange();
      },

      sendOrder: function(order) {
        $log.log(order);
      },

      receiveOrderUpdate: function(order){
        if (order) {
          var orderState = this.orders[order._id];
          _.extend(orderState, order);

          this.emitChange();
        };
      },
      exports: {
        getCart: function(barId) {
          return this.carts[barId];
        },

        getUser: function() {
          return this.user;
        },

        fetchBars: function(options) {
          var that = this;
          $log.log('fetching bars', that.user.private_channel);
          $dispatcher.pub({
            actions: {
              'get': {
                query: options.query,
                options: options.extra || {}
              }
            },
            respondTo: {
              action: 'receiveBars',
              channel: that.user.private_channel
            }
          }, 'bars');
        },

        getBars: function(query, options) {
          return this.bars;
        },
        getBar: function(id) {
          return _.find(this.bars, { _id: id });
        }
      }
    });
  })
  .factory('$dispatcher', function(PubNub, $rootScope, $log, CONFIG, $actions, $rootScope){
    var _alias = CONFIG.alias;
    var userGlobal = 'broadcast_user';
    var _pnCb = function(message) {
      if (message.to === _alias) {
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
        pbFlux.sub(user.private_channel);
        // subscribe to global users channel
        // will be used for future features
        pbFlux.sub(userGlobal);
        // $log.log('kickstart', user.private_channel, user.auth_key);
      },

      sub: function(channel) {
        // $log.log('subscribing to ' +channel)
        PubNub.ngSubscribe({
          channel: channel,
          callback: _pnCb,
          error: function(e) {
            $log.error(e);
          }
        });
      },

      pub: function(message, channel, cb) {
        message.from = _alias;
        message.to = 'API';
        cb = cb || function() {
          $log.log('pubbed');
        };

        PubNub.ngPublish({
          channel: channel,
          message: message,
          callback: cb
        });
      }
    };

    return pbFlux;
  });
