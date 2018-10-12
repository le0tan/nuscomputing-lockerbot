const { Issuer } = require('openid-client');
Issuer.discover('http://openid.nus.edu.sg') // => Promise
  .then(res => {
      console.log(res);
  });