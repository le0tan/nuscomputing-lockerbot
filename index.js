//import modules
const TelegramBot = require('node-telegram-bot-api');
const database = require('./db');
const axios = require('axios');
require("dotenv").config();

//create global constants
const {BOT_TOKEN, IVLE_API_KEY, IVLE_URL_CALLBACK} = process.env;
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

//main logic
bot.on('message', (msg) => {
  //extract command keyword and argument
  const command = msg.text.split(' ')[0];
  const args = msg.text.substr(command.length + 1);

  // console.log(msg.chat.id);

  switch(command){
    case '/start':{
      //prevent the same user from multiple registrations
      database.con.query('select count (*) from users where chat_id = ' + msg.chat.id + ';',
        function(err, res){
          if(err) throw err;
          else {
            if(JSON.parse(JSON.stringify(res[0]))['count (*)'] != 0){
              bot.sendMessage(msg.chat.id, 'Sorry but you have registered using this Telegram account before.');
            } else {
              //otherwise guide the user through the registration
              bot.sendMessage(
                msg.chat.id, `Hi ${msg.chat.first_name}! Let's get you set up!`,
                {
                  parse_mode: 'Markdown',
                  reply_markup: {
                    inline_keyboard: [
                      [{ text: 'Get IVLE Token', url: `https://ivle.nus.edu.sg/api/login/?apikey=${IVLE_API_KEY}&url=${IVLE_URL_CALLBACK}` }],
                    ],
                  },
                },
              );
            }
          }
      });
      break;
    }
    case '/token':{
      var token = args;
      //get the ivle id
      axios.get('https://ivle.nus.edu.sg/api/Lapi.svc/'+ 'UserID_Get' + '?APIKey='+ IVLE_API_KEY + '&Token=' + token)
        .then(resp => {
          var ivle_id = resp.data;
          database.con.query('select count (*) from users where ivle_id = "' + ivle_id + '";',
          function(err, res){
            if(err) throw err;
            else {
              //if ivle_id already exists in the db, abort the registration
              if(JSON.parse(JSON.stringify(res[0]))['count (*)'] != 0){
                bot.sendMessage(msg.chat.id, 'Sorry but your IVLE ID has been registered before.');
              } else {
                //insert new user to the db
                axios.get('https://ivle.nus.edu.sg/api/Lapi.svc/'+ 'UserName_Get' + '?APIKey='+ IVLE_API_KEY + '&Token=' + token)
                  .then(resp => {
                    var ivle_name = resp.data;
                    database.con.query(`insert into users(chat_id, ivle_id, ivle_name) values (${msg.chat.id}, "${ivle_id}", "${ivle_name}");`,
                    function(err, res){
                      if(err) throw err;
                      else {
                        console.log(`Successfully added user ${ivle_id}!`)
                      }
                    });
                  })
                  .catch(err => {
                    console.log(err);
                  });

              }
            }
          });          
        })
        .catch(err => {
          console.log(err);
        });

      break;
    }
    case '/serve':{
      bot.sendMessage(msg.chat.id, 'Sorry but the developer has not implemented this part');
      break;
    }
    default:{
      bot.sendMessage(msg.chat.id, "Wrong command!");
      break;
    }
  }
});

// https://ivle.nus.edu.sg/api/Lapi.svc/UserID_Get?APIKey={System.String}&Token={System.String}

//use this to access ivle api
//axios.get('https://ivle.nus.edu.sg/api/Lapi.svc/'+ api + '?APIKey='+ IVLE_API_KEY + '&Token=' + token)