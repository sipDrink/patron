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

    return flux.store({  //store places callbacks into the dispatcher so that when there is an action, dispatcher sends the data to the appropriate store callback.
      actions: [
        $actions.receiveUser,
        $actions.receiveBars,
        $actions.reset,
        $actions.updateCart,
        $actions.sendOrder,
        $actions.receiveOrderUpdate
      ],

      user: localStorageService.get('profile') || {}, //Pull user from localStorageService.get('profile') or set to empty object.  This will be updated when receiveUser below.
      bars: [],
      carts: {},
      orders: {},

      receiveUser: function(nUser) { //**just coordinates?  Latitude, longitude
        $log.log('incoming user at ', nUser);
        _.extend(this.user, nUser); //Copies all the properties of nUser into this.user.  Using extend overrides any properties of the same name, but will leave intact anything that already existed in this.user but doesn't exist in nUser.
        localStorageService.set('profile', this.user); //set profile in localStorageService to this.user
        this.emitChange(); //tells the view that something in the store has changed so it can update itself.
      },

      receiveBars: function(bars) {
        $log.log('list of bars: ', bars);
        this.bars = _.map(bars, function(bar) { //**Need to understand this.  Assuming it basically sets distance for each bar to distance between the bar's location and the user's coordinates
          bar.distance = ngGeodist.getDistance(this.user.coords, bar.loc, { format: true });
          return bar;
        }.bind(this));
        $log.log('first bar is ', this.bars[0]);
        this.emitChange();
      },

      reset: function() {
        this.bars = [];
        this.user = {};
        this.carts = {};
        this.orders = {};
        // this.emitChange(); //**Probably shouldn't be commented out
      },

      updateCart: function(barId, item, drinkname, clean) {
        if (clean) {
          this.carts[barId] = null; //sets the cart of a specific bar to null if a 4th parameter is ever passed in.  **Determine when does this happen
          this.emitChange();
          return;
        }
        var cart = this.carts[barId]; //if clean parameter wasn't passed in.  Persists existing cart by pulling this.carts[barId]
        if (drinkname) { //**Why remove from cart if there is a drinkname passed in?  Was this just a visual effect created when item added to cart?
          // remove from cart
          cart.splice(_.findIndex(cart, { name: drinkname }), 1); //**
        } else if (!cart) {
          this.carts[barId] = [item]; //if there was no cart for barId, create an array of the one item
        } else {
          if (item){
            cart.push(item); //if there are already items in the existing cart, push the new item in
          }
        }
        this.emitChange();
      },

      sendOrder: function(order) {
        $log.log(order);
        var newOrder = { //Object that is going to be published
          actions:{ //can add actions
            'order': { //callback for dispatcher
              order: order
            }
          },
          respondTo: { // newOrder.respondTo is used by the $dispatcher.pub to determine callbacks
            action: 'recieveOrder',
            channel: order.bar.channel
          }
        };
        $dispatcher.pub(newOrder, 'orders')
        //Shouldn't we do a this.emitChange(); so that we can update view when send the order?
      },

      receiveOrderUpdate: function(order){
        if (order) {
          var orderState = this.orders[order._id]; //Persists existing order.
          _.extend(orderState, order);  //Copy all the properties of order into orderState without eliminating what was already in orderState.  Overrides where duplicate property name.  _extend returns the first parameter, which is orderState.
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
          var that = this; //local variable makes channel private
          $log.log('fetching bars for ', that.user, that.user.private_channel);
          $dispatcher.pub({ //publishes a get request to 'bars' in the user's private channel.  Optional query and options in get request.
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
          return this.bars;  //all bars in the system. 
        },
        getBar: function(id) {
          return _.find(this.bars, { _id: id }); //return a specific bar using only an id
        }
      }
    });
  })
  .factory('$dispatcher', function(PubNub, $rootScope, $log, CONFIG, $actions, $rootScope){ //**Where does this come from?
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
