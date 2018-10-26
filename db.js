require("dotenv").config();
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;
var mysql = require('mysql');

var con = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

module.exports.con = con;

var cmd = "INSERT INTO users (chat_id, ivle_token) VALUES (123,'asd');";

con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});