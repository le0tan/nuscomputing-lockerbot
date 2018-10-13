# nuscomputing-lockerbot

A Telegram Bot for NUS SoC locker registration and management.

## Dependency

mysql-server@~8.0.12

node.js@~10.11.0

node-telegram-bot-api@npm ~0.30.0

axios@npm ~0.18.0

dotenv@npm ~6.1.0

mysql@npm ~2.16.0

## Environment constants

Credentials are stored in `.env` under root directory in form
```javascript
BOT_TOKEN = [omitted]
IVLE_API_KEY = [omitted]
IVLE_URL_CALLBACK = [omitted]
DB_HOST = [omitted]
DB_USER = [omitted]
DB_PASSWORD = [omitted]
TOKEN_SERVER_PORT = [omitted]
```
In consideration of privacy, add the file to `.gitignore`.

## Database configuration

### lockers

| Field        | Type         | Nullable | Key     | Default | Extra          |
|--------------|--------------|----------|---------|---------|----------------|
| id           | int(11)      | no       | PRIMARY | null    | auto_increment |
| owner_id     | int(11)      | yes      | FOREIGN | null    |                |
| location     | varchar(255) | no       |         | null    |                |
| description  | varchar(255) | yes      |         | null    |                |
| label        | int(11)      | no       |         | null    |                |
| request_date | date         | yes      |         | null    |                |
| expire_date  | date         | yes      |         | null    |                |

### users

| Field     | Type        | Nullable | Key     | Default | Extra          |
|-----------|-------------|----------|---------|---------|----------------|
| user_id   | int(11)     | no       | PRIMARY | null    | auto_increment |
| chat_id   | int(11)     | no       |         | null    |                |
| ivle_id   | varchar(10) | no       |         | null    |                |
| ivle_name | varchar(63) | yes      |         | null    |                |

## Deployment

```javascript
BOT_TOKEN = [omitted]
IVLE_API_KEY = http://[Your IP address]
IVLE_URL_CALLBACK = [omitted]
DB_HOST = [omitted]
DB_USER = [omitted]
DB_PASSWORD = [omitted]
TOKEN_SERVER_PORT = 80
```

and remember to allow inbound data through `:80`

## Dev Note

### To set callback url to localhost

(Assume you want to receive `POST` message via `localhost:8081`)

```bash
npm install http-echo-server -g
export PORT=8081
http-echo-server
```

This package will return whatever message it receives...