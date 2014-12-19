/**
* sip.main.bars.list.catergories Module
*
* catergories for each bar
*/
angular.module('sip.main.bars.list.detail.drinks',
  [

  ]
)
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.drinks', {
        url: '/drinks/:bar',
        templateUrl: 'app/main/bars/list/detail/drinks/drinks.tpl.html',
        controller: 'DrinksCtrl as drinks',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('DrinksCtrl', function($stateParams, $scope, $store, $log, $mdToast, $actions) {

    $store.bindTo($scope, function() {
      this.cart = $store.getCart($stateParams.bar);
    }.bind(this));
    this.drinks = $store.getBar($stateParams.bar).drinks;

    this.addToCart = function(drink) {
      $actions.updateCart($stateParams.bar, drink);
      $mdToast.show(
        $mdToast.simple()
        .content('1 ' + drink.name + ' added to cart')
        .position('top')
        .action('undo')
        .hideDelay(1800)
      ).then(function() {
        $actions.updateCart($stateParams.bar, null, drink.name);
      });
    };
  });
