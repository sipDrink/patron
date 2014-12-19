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
      controller: 'MainCtrl as main'
    });
})
.controller('MainCtrl', function($scope, $mdSidenav, $state, $dispatcher, $ionicPopover, $ionicHistory, $log, $rootScope, $store, $ionicModal, Auth) {
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
    $log.log('$mdSidenav ', what);
    $mdSidenav('left')[what]();
  };

  this.goAndClose = function(state) {
    this.nav('close');
    $state.go(state);
  };

  this.goBack = function(event) {
    $log.log('going back', event);
    $ionicHistory.goBack(event);
  };

  this.getPrevTitle = function() {
    return $ionicHistory.backTitle();
  };

  this.showCart = function(cart){
    // $scope.cart = car
    $scope.total = _.reduce(cart, function(total, item){
      total += item.price;
      return total;
    }, 0);

    $scope.cart = _.groupBy(cart, function(item) {
      return item.name;
    });

    $scope.modal.show();
  };

  $scope.closeCart = function(modal){
    modal.hide();
    $scope.cart = null;
  };
})
.controller('LeftCtrl', function(){
});
