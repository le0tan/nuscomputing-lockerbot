require("dotenv").config();
const {DB_HOST, DB_USER, DB_PASSWORD} = process.env;
var mysql = require('mysql');

var con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });
  
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

function queryWithLog(command){
  console.log("Command: " + command);
  con.query(command, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
}

module.exports.initialize = function (){
  queryWithLog("USE lockerbot_db");
  // queryWithLog("")
}