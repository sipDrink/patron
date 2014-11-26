/**
* sip.main.bars.list.drinks Module
*
* drinks for each bar
*/
angular.module('sip.main.bars.list.drinks', [])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.drinks', {
        url: '/drinks/:bar',
        templateUrl: 'app/main/bars/list/drinks/drinks.tpl.html',
        controller: 'DrinksCtrl as drinks',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('DrinksCtrl', function($stateParams, $scope, $store, $log) {
    this.bar = $store.getBar($stateParams.bar);
    $log.log(this.bar);
  });
