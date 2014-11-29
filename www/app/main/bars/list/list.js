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
        // authenticate: true
      });
  })
  .controller('BarListCtrl', function($scope, $timeout, Bars, $cordovaGeolocation, $log, $actions, $store, $cordovaVibration, $ionicLoading){
    angular.extend(this, Bars);
    var initial;
    var showLoader = function() {
      $log.log('loading');
      $ionicLoading.show({
        template: 'add nice icon...'
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
                $maxDistance: 60
              },
              completedSignUp: true
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
  })
  .factory('Bars', function(){

    var drinks = [
      { name: 'vodka', price: 12 },
      { name: 'whiskey', price: 8 },
      { name: 'fireball', price: 10 },
      { name: 'jack n coke', price: 6 },
      { name: 'superman', price: 11 },
      { name: 'rum', price: 15 },
      { name: 'vodka', price: 12 },
      { name: 'whiskey', price: 8 },
      { name: 'fireball', price: 10 },
      { name: 'jack n coke', price: 6 },
      { name: 'superman', price: 11 },
      { name: 'rum', price: 15 }

    ];
    return {
      barsNearUser: [
        { name: 'Blue Fin', distance: 0.3, people: 31, _id: 1, drinks: drinks },
        { name: 'Ruby Skye', distance: 0.2, people: 22, _id: 2, drinks: drinks },
        { name: 'Mr. Smith\'s', distance: 0.1, people: 40, _id: 3, drinks: drinks },
        { name: 'The Grand', distance: 0.1, people: 8, _id: 4, drinks: drinks },
        { name: 'Astroca', distance: 0.2, people: 11, _id: 5, drinks: drinks }
      ]
    };
  });
