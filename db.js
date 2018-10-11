require("dotenv").config();
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD
} = process.env;
var mysql = require('mysql');

var con = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: "lockerbot_db"
});

module.exports.con = con;

var cmd = "INSERT INTO users (chat_id, ivle_token) VALUES (123,'asd');";

con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});

function queryWithLog(command) {
  console.log('----------------queryWithLog Start----------------')
  console.log("Command: " + command);
  con.query(command, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
    console.log('----------------queryWithLog End----------------');
  });
}

module.exports.initialize = function () {
  queryWithLog("USE lockerbot_db");
  // queryWithLog("")
}

module.exports.addNewUser = function (chatId, ivleToken) {
  var cmd = 'insert into users(chat_id, ivle_token) values (' + chatId + ', "' + ivleToken + '");';
  queryWithLog(cmd);
};

// module.exports.isRegistered = function(chatId){
//   var cmd = 'select count (*) from users where chat_id = 450448905;';
//   con.query(cmd, function(err, res){
//     if(err) throw err;
//     else 
//   })
// };