/**
* sip.main.bars.list.drinks Module
*
* drinks for each bar
*/
angular.module('sip.main.bars.list.detail.categories.drinks', [])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.drinks', {
        url: '/drinks/:bar/:cat',
        templateUrl: 'app/main/bars/list/detail/categories/drinks/drinks.tpl.html',
        controller: 'DrinksCtrl as drinks',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('DrinksCtrl', function($stateParams, $scope, $store, $log, $actions, $mdToast) {
    $store.bindTo($scope, function() {
      this.cart = $store.getCart($stateParams.bar);
    }.bind(this));

    var bar = $store.getBar($stateParams.bar);
    this.drinks = _.find(bar.categories, { name: $stateParams.cat }).drinks;
    $log.log('drinks', this.drinks);

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
