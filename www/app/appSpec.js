describe('Module: sip', function() {
  var Sip;

  beforeEach(function() {
    Sip = angular.module('sip') ;
  });

  it('should be registered', function() {
    expect(Sip).to.be.an('object');
  });

  describe('dependencies', function() {
    var deps;

    var hasModule = function(m){
      return deps.indexOf(m) >= 0;
    };

    before(function() {
      deps = Sip.requires;
    });

    it('should have ionic as a dependency', function() {
      expect(hasModule('ionic')).to.be(true);
    });

    it('should have ngMaterial as a dependency', function() {
      expect(hasModule('ngMaterial')).to.be(true);
    });

    it('should have sip.auth as a dependency', function() {
      expect(hasModule('sip.auth')).to.be(true);
    });

    it('should have sip.common as a dependency', function() {
      expect(hasModule('sip.common')).to.be(true);
    });

    it('should have sip.main as a dependency', function() {
      expect(hasModule('sip.main')).to.be(true);
    });

    it('should have ngCordova as a dependency', function() {
      expect(hasModule('ngCordova')).to.be(true);
    });

    it('should have pubnub.angular.service as a dependency', function() {
      expect(hasModule('pubnub.angular.service')).to.be(true);
    });

    it('should have angular-jwt as a dependency', function() {
      expect(hasModule('angular-jwt')).to.be(true);
    });

    it('should have LocalStorageModule as a dependency', function() {
      expect(hasModule('LocalStorageModule')).to.be(true);
    });

    it('should have flux as a dependency', function() {
      expect(hasModule('flux')).to.be(true);
    });

    it('should have auth0 as a dependency', function() {
      expect(hasModule('auth0')).to.be(true);
    });

    it('should have ngGeodist as a dependency', function() {
      expect(hasModule('ngGeodist')).to.be(true);
    });
  });

  describe('AppController', function() {
    it('should have an AppController', function() {
      expect(Sip.AppController).to.be.ok;
    });
  });


});
