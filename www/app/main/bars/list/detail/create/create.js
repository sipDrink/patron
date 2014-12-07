/**
* sip.main.bars.list.catergories Module
*
* catergories for each bar
*/
angular.module('sip.main.bars.list.detail.create',[
  'sip.main.bars.list.detail.create.brands'
])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.create', {
        url: '/create/:bar',
        templateUrl: 'app/main/bars/list/detail/create/create.tpl.html',
        controller: 'CreateCtrl as create',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('CreateCtrl', function($stateParams, $scope, $store, $log) {
    $store.bindTo($scope, function() {
      this.bar = $store.getBar($stateParams.bar);
      this.cart = $store.getCart($stateParams.bar);
    }.bind(this));
  });
