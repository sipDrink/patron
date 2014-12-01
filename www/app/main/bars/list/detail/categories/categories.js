/**
* sip.main.bars.list.catergories Module
*
* catergories for each bar
*/
angular.module('sip.main.bars.list.detail.categories',
  [
    'sip.main.bars.list.detail.categories.drinks'
  ]
)
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.categories', {
        url: '/categories/:bar',
        templateUrl: 'app/main/bars/list/detail/categories/categories.tpl.html',
        controller: 'CategoriesCtrl as categories',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('CategoriesCtrl', function($stateParams, $scope, $store, $log) {
    $log.log($stateParams)
    $store.bindTo($scope, function() {
      this.bar = $store.getBar($stateParams.bar);
      this.cart = $store.getCart($stateParams.bar);
    }.bind(this));
  });
