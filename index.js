//import modules
const TelegramBot = require('node-telegram-bot-api');
const database = require('./db');
const axios = require('axios');
require("dotenv").config();
// require("./token_server");

//create global constants
const {BOT_TOKEN, IVLE_API_KEY, IVLE_URL_CALLBACK} = process.env;
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

//-----------Main Logic-----------

//sender bot
bot.on('message', (msg) => {
  //extract command keyword and argument
  const command = msg.text.split(' ')[0];
  const args = msg.text.substr(command.length + 1);

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
    case '/request':{
      //select only the locations with lockers without an owner
      database.con.query(`select distinct location from lockers where owner_id is null;`,
      function(err, res){
        if(err) throw err;
        else {
          //query locations of the lockers
          //stored in Array 'mapped'
          const json_res = JSON.parse(JSON.stringify(res));
          const len = json_res.length;
          const mapped =  new Array;
          for(let i = 0; i < len; i++){
            const content = json_res[i].location;
            mapped.push([{ text : content, callback_data: content }]);
          }
          //create inline keyboard to show locations available
          {
            let options = {
              reply_markup: `{"inline_keyboard": ${JSON.stringify(mapped)}}`
            };
            // console.log(options);
            bot.sendMessage(msg.chat.id, "Here are the locations available", options);
          }
        }
      });
      break;
    }
    case '/show':{
      database.con.query(`select user_id from users where chat_id = ${msg.chat.id};`,
        function(err, res){
          if(err) console.log(err);
          else {
            const db_user_id = JSON.parse(JSON.stringify(res[0]))['user_id'];
            database.con.query(`select location, description, label from lockers where owner_id = ${db_user_id};`,
              function(err, res){
                if(err) console.log(err);
                else {
                  const json_obj = JSON.stringify(res);
                  bot.sendMessage(msg.chat.id, json_obj);
                }
              });
          }
        });
      break;
    }
    case '/test':{
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
      break;
    }
    default:{
      bot.sendMessage(msg.chat.id, "Wrong command!");
      break;
    }
  }
});

//receive the callback data to respond
bot.on('callback_query', (callbackQuery) => {
  //handle the location choice callback
  {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const switcher = action.split(' ');
    switch(switcher[0]){
      case 'Confirmed':{
        //confirmed, add user-locker pair to the database
        const loc = switcher[1];
        database.con.query(`select user_id from users where chat_id = ${msg.chat.id};`,
          function(err, res){
            if(err) throw err;
            else {
              const db_user_id = JSON.parse(JSON.stringify(res[0]))['user_id'];
              const now = new Date();
              const now_string = now.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0];
              const expire_days = 30;
              now.setTime(now.getTime() + expire_days * 86400000);
              const expire_string = now.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0];
              //TODO: Return only the updated row (set @temp and select @temp doesn't work in Node.js)
              // const syntax = `set @temp := 0; 
              //                 update lockers 
              //                 set id=(select @temp:=id), 
              //                     owner_id = ${db_user_id}, 
              //                     request_date = '${now_string}', 
              //                     expire_date = '${expire_string}' 
              //                 where location = '${loc}'
              //                       and owner_id is null
              //                 limit 1; 
              //                 select description from lockers where id=@temp;`;
              const syntax = `update lockers 
                              set owner_id = ${db_user_id}, 
                                  request_date = '${now_string}', 
                                  expire_date = '${expire_string}' 
                              where location = '${loc}'
                                    and owner_id is null
                              limit 1;`;
              database.con.query(syntax,
                function(err, res){
                  if(err) console.log(err);
                  else {
                    //return the requested lockers for the user
                    //TODO: Make the returned results more readable
                    database.con.query(`select location, description, label from lockers where owner_id = ${db_user_id};`,
                      function(err, res){
                        const json_obj = JSON.stringify(res);
                        bot.sendMessage(msg.chat.id, json_obj);
                      });
                  }
                });
            }
          });
        break;
      }
      case 'NotConfirmed':{
        //not confirmed, prompt the user to request again
        bot.sendMessage(msg.chat.id, `OK. You may send /request again to request again!`);
        break;
      }
      default:{
        const inlineMessage = [[
          {text: 'Yes', callback_data: 'Confirmed ' + action},  //we need to send location back!
          {text: 'No', callback_data: 'NotConfirmed'}
        ]];
        const opts = {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          reply_markup: JSON.stringify({ inline_keyboard: inlineMessage })
        };
        let text = `You request a locker at ${action}, is that correct?`;
        //send the confirmation message
        bot.editMessageText(text, opts).catch(
          (err) => {
            //if the user calls the inline keyboard twice due to network lag, this magic error happens
            console.log("The user pressed the button twice...");
          }
        );
        break;
      }
    }
  }
});

//use this to access ivle api
//axios.get('https://ivle.nus.edu.sg/api/Lapi.svc/'+ api + '?APIKey='+ IVLE_API_KEY + '&Token=' + token)