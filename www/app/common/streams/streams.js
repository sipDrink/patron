/**
* sip.common.streams Module
*
* Description
*/
angular.module('sip.common.streams', [])
  .factory('PB', function(PubNub, $rootScope, $log){
    $rootScope.$on(PubNub.ngMsgEv('sip'), function(e, p) {
      $log.log(p);
    });

    var pb = {
      sub: function(config, cb) {
        PubNub.ngSubscribe(config);
        $rootScope.$on(PubNub.ngMsgEv(config.channel), cb);
      },
      pub: function(config) {
        PubNub.ngPublish(config);
      },
      init: function(auth){
        PubNub.init({
          publish_key: 'pub-c-e7567c4a-b42c-4a6d-af64-b9e6db79424d',
          subscribe_key: 'sub-c-e72ce3bc-6960-11e4-8e76-02ee2ddab7fe',
          auth_key: auth
        });
      }
    };

    return pb;
  });
