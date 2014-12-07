/**
* sip.main.bars.list Module
*
* Description
*/
angular.module('sip.main.bars.list', [
'sip.main.bars.list.detail'
])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.bars.list', {
        url: '/list',
        templateUrl: 'app/main/bars/list/list.tpl.html',
        controller: 'BarListCtrl as bars',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('BarListCtrl', function($scope, $timeout, $ionicHistory, $cordovaGeolocation, $log, $actions, $store, $cordovaVibration, $ionicLoading){
    $ionicHistory.clearHistory();

    var initial;
    var showLoader = function() {
      $log.log('loading');
      $ionicLoading.show({

        template:  '<md-progress-circular md-theme="teal" md-mode="indeterminate"></md-progress-circular>',
        duration: 5000
      });
      initial = true;
    };

    var getBars = function(e, v) {
      $cordovaGeolocation
        .getCurrentPosition()
        .then(function(position) {
          var coords = [position.coords.latitude, position.coords.longitude];
          $actions.receiveUser({coords: coords});
          var opts = {
            query: {
              loc: {
                $near: coords,
                $maxDistance: 6000
              },
              completedSignUp: true
            },
            extra: {
              populate: 'drinkTypes',
              limit: 10
            }
          };
          $store.fetchBars(opts);
          if (e) {
            $scope.$broadcast(e);
          }

          if (v) {
            // $cordovaVibration.vibrate(150);
          }

          if (initial) {
            $ionicLoading.hide();
            initial = false;
          }

        }, function(err) {
          if (e) {
            $scope.$broadcast(e);
          }
          $log.error(err);
        });
      };

    $store.bindTo($scope, function() {
      this.bars  = $store.getBars();
    }.bind(this));

    $scope.$on('$ionicView.loaded', function(message) {
      showLoader();
      getBars();
      // $timeout(function() {
      //   getBars();
      // }, 1200);
    });

    this.refreshBars = function() {
      getBars('scroll.refreshComplete', true);
    };
  });
