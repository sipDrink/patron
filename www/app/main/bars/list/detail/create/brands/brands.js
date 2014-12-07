/**
* sip.main.bars.list.catergories Module
*
* catergories for each bar
*/
angular.module('sip.main.bars.list.detail.create.brands',
  [

  ]
)
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.brands', {
        url: '/brands/:bar/:type',
        templateUrl: 'app/main/bars/list/detail/create/brands/brands.tpl.html',
        controller: 'BrandCtrl as brand',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('BrandCtrl', function($stateParams, $scope, $store, $log, $mdToast, $actions) {
    var types = $store.getBar($stateParams.bar).drinkTypes;
    this.label = _.find(types, { _id: $stateParams.type });
    $log.log(this.label);
  });
