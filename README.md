# nuscomputing-lockerbot
A Telegram Bot for NUS SoC locker registration and management.

## Dependency
This repo uses [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) created by [yagop](https://github.com/yagop).
Please run `npm install` to resolve dependencies before using this repo.
Also, credentials like our Telegram bot token are stored in `credntial.js` in a form like
```javascript
module.exports = Object.freeze({
    token: 'YOUR_TOKEN_HERE'
});
```
In consideration of privacy, we added the file to `.gitignore` so please create your own `credntial.js`.
