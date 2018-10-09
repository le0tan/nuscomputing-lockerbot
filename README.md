# nuscomputing-lockerbot
A Telegram Bot for NUS SoC locker registration and management.

## Dependency
This repo uses [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) created by [yagop](https://github.com/yagop).
Please run `npm install` to resolve dependencies before using this repo.
Also, credentials like our Telegram bot token are stored in `.env` under root directory in form
```javascript
BOT_TOKEN = ...
IVLE_API_KEY = ...
IVLE_URL_CALLBACK = ...
```
In consideration of privacy, add the file to `.gitignore`.
