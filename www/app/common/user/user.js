/**
* sip.common.user Module
*
* Description
*/
angular.module('sip.common.user', [])
  .factory('User', function($mdBottomSheet, $q, $state, PB, $rootScope, CONFIG) {

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
    var channel;
    var User = {};


    User.initStreams = function(user) {
      console.log('init');
      channel = 'private-'+user._id;

      PB.init(user.auth_key);

      // PB.pub({
      //   channel: channel,
      //   message: {data: 'give me data'},
      //   error: function(e){
      //     console.error(e)
      //   },
      //   callback: function(){
      //     console.log('pubbed!!');
      //   }
      // });

      PB.sub({
        channel: channel,
        message: function(message){
          if (message.to === CONFIG.alias) {
            console.log(message.actions);
          }
        }
      });

      User.update();
    };

    User.update = function(values) {
      console.log('updating');

      var user = angular.copy($rootScope.user);
      user.name = "Will Scott Moss";
      PB.pub({
        channel: channel,
        message: {
          to: 'API',
          actions: {
            'update': user
          }
        }
      });
    };

    return User;
  });
