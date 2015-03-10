/**
* sip.main.bars.list.catergories Module
*
* catergories for each bar
*/
angular.module('sip.main.bars.list.detail', [
  'sip.main.bars.list.detail.drinks',
  'sip.main.bars.list.detail.create'
])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.detail', {
        url: '/detail/:bar',
        templateUrl: 'app/main/bars/list/detail/detail.tpl.html',
        controller: 'DetailCtrl as detail',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('DetailCtrl', function($stateParams, $scope, $store, $log) {
    $store.bindTo($scope, function() {
      this.bar = $store.getBar($stateParams.bar); //detail.bar since controller DetailCtrl defined as detail above
      this.cart = $store.getCart($stateParams.bar);
    }.bind(this));
  });
