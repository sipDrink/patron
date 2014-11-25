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
      abstract: true,
      views: {
        'pane': {
          template: '<ion-nav-view></ion-nav-view>'
        }
      }
    });
});
