const https = require('https');
const axios = require('axios');
require("dotenv").config();
const {IVLE_API_KEY} = process.env;


module.exports.getName = (token) => {
    axios.get('https://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey='+ IVLE_API_KEY + '&Token=' + token)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}
