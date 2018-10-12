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
    var body = `<head>
                    <title>SoC LockerBot</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                </head>
                <body>
                    <span>
                        <p width="100%">Please copy the following line to Telegram Bot conversation</p>
                    </span>
                    
                    <button type="button" class="btn btn-default" data-clipboard-target="#token"><img src="https://clipboardjs.com/assets/images/clippy.svg" alt="Copy to clipboard" width="10%"></button>
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
                    <input type="text" class="form-control" value="${ans}" id="token">
                </body>
                `;
    res.end(body);
}).listen(TOKEN_SERVER_PORT); //the server object listens on port 8080

//unused file server
// http.createServer(function(req, res){
//     fileServer.serve(req, res);
// }).listen(2333);