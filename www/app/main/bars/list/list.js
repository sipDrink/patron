/**
* sip.main.bars.list Module
*
* Description
*/
angular.module('sip.main.bars.list', [
'sip.main.bars.list.drinks'
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
  .controller('BarListCtrl', function($scope, Bars, $cordovaGeolocation, $log, $actions, $store){
    angular.extend(this, Bars);

    $store.bindTo($scope, function() {
      this.bars  = $store.returnBars();
      console.log('this.bars', this.bars);
    }.bind(this));

    $scope.$on('$ionicView.enter', function(message) {
      $cordovaGeolocation
        .getCurrentPosition()
        .then(function(position) {
          $store.fetchBars(position);
        }, function(err) {
          $log.error(err);
        });
    });
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
