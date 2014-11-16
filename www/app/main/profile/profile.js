/**
* sip.main.profile Module
*
* profile module
*/
angular.module('sip.main.profile', [])
  .config(function($stateProvider) {
    $stateProvider
      .state('sip.main.profile', {
        url: '/profile',
        views: {
          'pane': {
            templateUrl: 'app/main/profile/profile.tpl.html',
            controller: 'ProfileCtrl as profile'
          }
        },
        authenticate: true
      });
  })
  .controller('ProfileCtrl', function(){

  });
