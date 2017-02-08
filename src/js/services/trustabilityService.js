'use strict';

app.factory('TrustabilityService', function($http, TRUST_SERVICE_URL) {

  return {
    getTrustabilityFromHost: function(host) {
      return $http.get(TRUST_SERVICE_URL, {
        params: {
          host: host,
        },
      });
    },
    getTrustabilityValueFromHost: function(host) {
      return this.getTrustabilityFromHost(host)
        .then(this.calculateTrustability);
    },
    calculateTrustability: function(res) {
      res = res.data;
      if (res && res.rows.length > 0) {
        var noCriteria = res.rows.length;
        return Math.ceil((noCriteria / 9) * 100);
      }
      return 0;
    },
  };
});