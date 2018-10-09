const TelegramBot = require('node-telegram-bot-api');
const env_const = require("dotenv").config();
const {BOT_TOKEN, IVLE_API_KEY, IVLE_URL_CALLBACK} = process.env;

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

bot.on('message', (msg) => {
    
    var Hi = "hi";

    console.log(msg.text.toString());

    // if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    //     bot.sendMessage(msg.chat.id,"Hello dear user");
    // } else {
    //     bot.sendMessage(
    //         msg.chat.id, `Hi ${msg.chat.first_name}! Let's get you set up!`);
    // }

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

});

