 /**
* sip.main Module
*
* Description
*/
angular.module('sip.main', [
  'sip.main.bars',
  'sip.main.profile',
  'sip.main.payments'
])
.config(function($stateProvider) {
  $stateProvider
    .state('sip.main', {
      url: '/main',
      abstract: true,
      templateUrl: 'app/main/main.tpl.html',
      controller: 'MainController as main'
    });
})
.controller('MainController', function($scope, $mdDialog, $mdSidenav, $state, $dispatcher, $ionicPopover, $ionicHistory, $log, $rootScope, $store, $ionicModal, Auth, $mdToast, $location, $actions) {
  // var that = this;
  $dispatcher.kickstart($store.getUser());

  $ionicModal.fromTemplateUrl('app/main/cartModal.tpl.html', {
    scope: $scope
  }).then(function(modal){
    $scope.modal = modal;
  }.bind(this));

  this.signout = function() {
    Auth.signout();
  };

  this.nav = function(what){
    $mdSidenav('left')[what]();
  };

  this.goAndClose = function(state) {

    this.nav('close');
    $state.go(state);
  };

  this.goBack = function(event) {

    $ionicHistory.goBack(event);
  };

  this.getPrevTitle = function() {
    return $ionicHistory.backTitle();
  };

  var calcTotal = function(cart){
    return _.reduce(cart, function(total, item){
      total += item.price;
      return total;
    }, 0);
  };

  var calcCart = function(cart){
    if (_.isEmpty(cart)) {
      return $scope.closeCart($scope.modal);
    }

    var total = calcTotal(cart);

    $scope.cart = _(cart).groupBy(function(item) {
      return item.name;
    })
    .map(function(group, name) {
      group.total = group[0].price * group.length;
      group.name = name;
      return group;
    }).value();

    $scope.cart.total = total;
  };

  var getBarId = function() {
    return $location.path().split('/').pop();
  };

  var getMainCard = function(href){
    var cards = $store.getUser.cards;
    if (href) {
      return _.result(_.find(cards, { main: true }), 'href');
    }

    return _.find(cards, { main: true });
  };

  $scope.userMainCard = getMainCard();

  this.showCart = function(cart){
    if (_.isEmpty(cart)) {
      $mdToast.show(
        $mdToast.simple()
        .content('CART IS EMPTY')
        .position('bottom')
        .hideDelay(1800));
      return;
    }

    calcCart(cart);

    $scope.modal.show();
  };

  $scope.closeCart = function(modal){
    $scope.cart = null;
    return modal.hide();
  };

  $scope.modifyCart = function(item, name) {
    var barId = getBarId();
    var args = _.toArray(arguments);
    args.unshift(barId);
    $actions.updateCart.apply(null, args);
    calcCart($store.getCart(barId));
  };

  $scope.sendOrder = function(cart){
    var user = $store.getUser();
    // var cart = $store.getBar(barId);
    var barId = getBarId();

    var card = getMainCard(true);

    var code = (Math.random() + 1).toString(36).substring(14);
    var order = {
      user: {
        name: user.name,
        cc: card,
        img: user.picture,
        channel: user.privateChannel
      },

      order: cart,

      bar: barId,
      code: code
    };

    var username = user.name.split(' ').length > 1 ? user.name.split(' ')[0] : user.name;

    $actions.sendOrder(order);
    $actions.updateCart(barId, null, null, true);
    $scope.closeCart($scope.modal).then(function(){
      $mdDialog.show(
        $mdDialog.alert()
          .title('Thanks ' + username + ', your drink is being made. We\'ll keep you updated' )
          .content('Drink responsibly')
          .ok('Dope')
      )
    });

    // $state.go('app.main.orders');
  };
});
