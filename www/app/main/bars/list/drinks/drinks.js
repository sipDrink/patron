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
  .controller('DrinksCtrl', function($stateParams, $mdToast, Bars) {
    console.log($mdToast);
    this.bar = _.find(Bars.barsNearUser, { _id: $stateParams.bar }) || Bars.barsNearUser[0];
    var toast = {
      hideDelay: 0,
      template: 'drink added',
      position: 'left'
    };

    this.toast = function() {
      console.log('toast');
      $mdToast.show(toast);
    };
  });
