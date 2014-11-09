/**
* sip.main Module
*
* Description
*/
angular.module('sip.main', [
  'sip.main.bars'
])
.config(function($stateProvider) {
  $stateProvider
    .state('sip.main', {
      url: '/main',
      abstract: true,
      templateUrl: 'app/main/main.tpl.html',
      controller: 'MainCtrl as main'
    });
})
.controller('MainCtrl', function($scope, $mdSidenav) {
  this.nav = function(what){
    $mdSidenav('left')[what]();
  };

})
.controller('LeftCtrl', function(){
})
