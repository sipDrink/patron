/**
* sip.main.bars Module
*
* Description
*/
angular.module('sip.main.bars', [
  'sip.main.bars.list'
])
.config(function($stateProvider) {
  $stateProvider
    .state('sip.main.bars', {
      url: '/bars',
      views: {
        'pane': {
          abstract: true,
          template: '<ion-nav-view></ion-nav-view>'
        }
      }
    });
})
