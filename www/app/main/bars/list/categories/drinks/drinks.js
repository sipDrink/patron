/**
* sip.main.bars.list.drinks Module
*
* drinks for each bar
*/
angular.module('sip.main.bars.list.categories.drinks', [])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.drinks', {
        url: '/drinks/:bar/:cat',
        templateUrl: 'app/main/bars/list/categories/drinks/drinks.tpl.html',
        controller: 'DrinksCtrl as drinks',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('DrinksCtrl', function($stateParams, $scope, $store, $log) {
    var bar = $store.getBar($stateParams.bar);
    this.drinks = _.find(bar.categories, { name: $stateParams.cat }).drinks;
    $log.log('drinks', this.drinks);
  });
