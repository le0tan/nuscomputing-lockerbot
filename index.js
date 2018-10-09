const TelegramBot = require('node-telegram-bot-api');
const credentials = require('./credential');
const token = credentials.token;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id,"Hello dear user");
    } else {
        bot.sendMessage(msg.chat.id, "You said " + msg.text.toString() + "\n" + "Not what I was expecting though...");
    }
        
});