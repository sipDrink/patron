/**
* sip.common.streams Module
*
* Description
*/
angular.module('sip.common.streams', [])
  .factory('PB', function(PubNub, $rootScope, $log){
    PubNub.init({
      publish_key: 'pub-c-e7567c4a-b42c-4a6d-af64-b9e6db79424d',
      subscribe_key: 'sub-c-e72ce3bc-6960-11e4-8e76-02ee2ddab7fe'
    });

    $rootScope.$on(PubNub.ngMsgEv('sip'), function(e, p) {
      $log.log(p);
    });

    var pb = {
      sub: function(config) {
        PubNub.ngSubscribe(config);
      },
      pub: function(config) {
        PubNub.ngPublish(config);
      }
    };

    return pb;
  });
