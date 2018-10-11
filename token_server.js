var http = require('http');
var url = require('url');
require("dotenv").config();
const {TOKEN_SERVER_PORT} = process.env;

//create a server object:
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var ans = '/token ' + q.token;
    console.log(ans);

    var body = 'Please copy the following line to Telegram Bot conversation <br/>' 
                + '<script>function myFunction() {var copyText = document.getElementById("token");copyText.select();document.execCommand("copy");alert("Copied");}</script>'
                + '<input type="text" value="' + ans + '" id="token">'
                + '<button onclick="myFunction()">Copy text</button>';
    res.end(body);
}).listen(TOKEN_SERVER_PORT); //the server object listens on port 8080
