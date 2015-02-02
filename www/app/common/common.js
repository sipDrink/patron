/**
* sip.common Module
*
* Description
*/
angular.module('sip.common', [
  'sip.common.user',
  'sip.common.flux'
])
.constant('URLS', {
  api: 'https://powerful-badlands-7666.herokuapp.com/api/v1',
  facebook: 'https://powerful-badlands-7666.herokuapp.com/auth/facebook'
})
.constant('CONFIG', {
  alias: 'mobile' // used for PUBNUB channels
})
.directive('sipRipple', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var x, y;

      element.on('click touchstart', function(e) {
        var ripple = this.querySelector('.angular-ripple');
        var eventType = e.type;
        // Ripple
        if (ripple === null) {
          // Create ripple
          ripple = document.createElement('span');
          ripple.classList.add('angular-ripple');

          // Prepend ripple to element
          this.insertBefore(ripple, this.firstChild);

          // Set ripple size
          if (!ripple.offsetHeight && !ripple.offsetWidth) {
            var size = Math.max(e.target.offsetWidth, e.target.offsetHeight);
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
          }
        }

        // Remove animation effect
        ripple.classList.remove('animate');

        // get click coordinates by event type
        if (eventType === 'click') {
          x = e.pageX;
          y = e.pageY;
        } else if(eventType === 'touchstart') {
          x = e.changedTouches[0].pageX;
          y = e.changedTouches[0].pageY;
        }
        x = x - this.offsetLeft - ripple.offsetWidth / 2;
        y = y - this.offsetTop - ripple.offsetHeight / 2;

        // set new ripple position by click or touch position
        ripple.style.top = y + 'px';
        ripple.style.left = x + 'px';

        // Add animation effect
        ripple.classList.add('animate');

      });
      }
    };
  });
