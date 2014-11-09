/**
* sip.main.bars.list Module
*
* Description
*/
angular.module('sip.main.bars.list', [])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.list', {
        url: '/list',
        templateUrl: 'app/main/bars/list/list.tpl.html',
        controller: 'BarListCtrl as barList',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('BarListCtrl', function($scope){
  });
