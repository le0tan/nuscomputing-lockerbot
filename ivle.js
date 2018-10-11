// const https = require('https');
// const Promise = require('promise');
// const axios = require('axios');
require("dotenv").config();
const {IVLE_API_KEY} = process.env;
const api = "UserName_Get";

// function ivle_lapi(api, token){
//     const x = axios.get('https://ivle.nus.edu.sg/api/Lapi.svc/'+ api + '?APIKey='+ IVLE_API_KEY + '&Token=' + token);
// }


// module.exports.getName = async function (token) {
//     const res = await ivle_lapi("UserName_Get", token);
//     return res.data;
// }

module.exports.getName = function (ans){
    const request = require('request');
    request('https://ivle.nus.edu.sg/api/Lapi.svc/'+ api + '?APIKey='+ IVLE_API_KEY + '&Token=' + token,
            { json: true },
            (err, res, body) => {
                if (err) { return console.log(err); }
                console.log(body);
                ans = body;
                });    
}
