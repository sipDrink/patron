/**
* sip.common.user Module
*
* Description
*/
angular.module('sip.common.user', [])
  .factory('User', function($mdBottomSheet, $q, $state, PB) {

    // var UserFactory = {
    //   showListBottomSheet: function($event, cb) {
    //     $mdBottomSheet.show({
    //       templateUrl: 'app/auth/bottom-sheet-tpl.html',
    //       targetEvent: $event,
    //       controller: function($scope, $mdBottomSheet) {
    //         $scope.items = [
    //           { name: 'Share', icon: 'share' },
    //           { name: 'Upload', icon: 'upload' },
    //           { name: 'Copy', icon: 'copy' },
    //           { name: 'Print this page', icon: 'print' },
    //         ];

    //         $scope.listItemClick = function($index) {
    //           var clickedItem = $scope.items[$index];
    //           $mdBottomSheet.hide(clickedItem);
    //         };
    //       }
    //     })
    //     .then(function() {
    //       if (cb) cb();
    //     });
    //   },

    // };

    // return UserFactory;

    // return $resource(URLS.api + '/user/:id', { id: '@_id' }, {
    //   current: {
    //     method: 'GET',
    //     isArray: false,
    //     url: URLS.api + '/user/current'
    //   }
    // });

    return {};
  });
