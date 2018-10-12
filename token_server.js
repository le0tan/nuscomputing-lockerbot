var http = require('http');
var url = require('url');
// var nStatic = require('node-static');
// var fileServer = new nStatic.Server('./asset');
require("dotenv").config();
const {TOKEN_SERVER_PORT} = process.env;

//create a server object:
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var ans = '/token ' + q.token;
    console.log(ans);

    var body = `
                Please copy the following line to Telegram Bot conversation <br/>
                <button class="btn" data-clipboard-target="#token"><img src="https://clipboardjs.com/assets/images/clippy.svg" alt="Copy to clipboard" width="30"></button>
                <script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
                <script>
                    var clipboard = new ClipboardJS('.btn');
                    clipboard.on('success', function(e) {
                        console.log(e);
                    });
                    clipboard.on('error', function(e) {
                        console.log(e);
                    });
                </script>
                <input type="text" value="${ans}" id="token" width="2000" height="2000">
                `;
    res.end(body);
}).listen(TOKEN_SERVER_PORT); //the server object listens on port 8080

//unused file server
// http.createServer(function(req, res){
//     fileServer.serve(req, res);
// }).listen(2333);