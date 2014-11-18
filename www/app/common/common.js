/**
* sip.common Module
*
* Description
*/
angular.module('sip.common', [
  'sip.common.user',
  'sip.common.streams'
])
.constant('URLS', {
  api: 'https://powerful-badlands-7666.herokuapp.com/api/v1',
  facebook: 'https://powerful-badlands-7666.herokuapp.com/auth/facebook'
})
.constant('CONFIG', {
  alias: 'mobile' // used for PUBNUB channels
});
