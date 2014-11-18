/**
* sip.main Module
*
* Description
*/
angular.module('sip.main', [
  'sip.main.bars',
  'sip.main.profile'
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
.controller('MainCtrl', function($scope, $mdSidenav, $state,$ionicPopover, $ionicHistory, $log, PB, $rootScope) {

  // PB.sub({ channel: 'sip' });
  this.user = $rootScope.user;

  this.nav = function(what){
    $log.log('nav:', what);
    $mdSidenav('left')[what]();
  };

  this.goAndClose = function(state) {
    this.nav('close');
    $state.go(state);
  };

  this.goBack = function(event) {
    $log.log('going back', event);
    $ionicHistory.goBack(event);
  };

  this.getPrevTitle = function() {
    return $ionicHistory.backTitle();
  };

  // angular.extend(this, auth);

  var that = this;
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    that.popover = popover;
  });
  that.openPopover = function($event) {
    that.popover.show($event);
  };
  that.closePopover = function() {
    that.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    that.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

})
.controller('LeftCtrl', function(){
})
