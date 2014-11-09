/**
* sip.common.user Module
*
* Description
*/
angular.module('sip.common.user', [])
  .factory('UserFactory', function($mdBottomSheet, auth, store, $q) {
    return {
      showListBottomSheet: function($event, cb) {
        $mdBottomSheet.show({
          templateUrl: 'app/auth/bottom-sheet-tpl.html',
          targetEvent: $event,
          controller: function($scope, $mdBottomSheet) {
            $scope.items = [
              { name: 'Share', icon: 'share' },
              { name: 'Upload', icon: 'upload' },
              { name: 'Copy', icon: 'copy' },
              { name: 'Print this page', icon: 'print' },
            ];

            $scope.listItemClick = function($index) {
              var clickedItem = $scope.items[$index];
              $mdBottomSheet.hide(clickedItem);
            };
          }
        })
        .then(function() {
          if (cb) cb();
        });
      },
      signIn: function() {
        var defer = $q.defer();
        console.log(auth);
        auth.signin({
          popup: true,
          // Make the widget non closeable
          standalone: true,
          // This asks for the refresh token
          // So that the user never has to log in again
          authParams: {
            scope: 'openid offline_access'
          }
        }, function(profile, idToken, accessToken, state, refreshToken) {
          store.set('profile', profile);
          store.set('token', idToken);
          store.set('refreshToken', refreshToken);
          defer.resolve(profile);
          // $state.go('sip.main.bars.list');
        }, function(error) {
          defer.reject(error);
          console.log("There was an error logging in", error);
        });
        return defer.promise;
      }
    };
  });
