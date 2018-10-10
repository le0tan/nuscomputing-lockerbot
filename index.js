const TelegramBot = require('node-telegram-bot-api');
const database = require('./db');
require("dotenv").config();
const {BOT_TOKEN, IVLE_API_KEY, IVLE_URL_CALLBACK} = process.env;

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

bot.on('message', (msg) => {
  const command = msg.text.split(' ')[0];
  const args = msg.text.substr(command.length + 1);

  switch(command){
    case '/start':{
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
    case '/token':{
      bot.sendMessage(msg.chat.id, "Your token is: "+args);
      break;
    }
    default:{
      bot.sendMessage(msg.chat.id, "Wrong command!");
      break;
    }
  }

});