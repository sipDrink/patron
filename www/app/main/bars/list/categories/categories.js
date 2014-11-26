/**
* sip.main.bars.list.catergories Module
*
* catergories for each bar
*/
angular.module('sip.main.bars.list.categories',
  [
    'sip.main.bars.list.categories.drinks'
  ]
)
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.categories', {
        url: '/categories/:bar',
        templateUrl: 'app/main/bars/list/categories/categories.tpl.html',
        controller: 'CategoriesCtrl as categories',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('CategoriesCtrl', function($stateParams, $scope, $store, $log) {
    $store.bindTo($scope, function() {
      this.bar = $store.getBar($stateParams.bar);
    }.bind(this));
    $log.log('grid', this.bar);
  });
