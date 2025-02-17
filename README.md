# eKonsilio - LiveChat

## Backend Specs

- Framework used: NestJS
- Database: PostgreSQL
- ORM: TypeORM

## Frontend Specs

- Framework used: React w/ ViteJS
- Libs: Mantine & Tailwind

## Getting started

Clone the project first. Then you've to create .env file in frontend/admin and frontend/client.

Here's defaults values:
```env
VITE_API_URL=http://localhost:14000
VITE_WEBSOCKET_URL=http://localhost:8080
``` 

To run the project, open a terminal in the project root folder, the run:

```bash
docker-compose up --build
```

If everyrging's runs good, you can access Admin on: <br />
http://localhost:5173<br />
<br />
You can access visitor on: <br />
http://localhost:5174<br />
<br />
You can connect to DB on: <br />
postgresql://admin:adminpassword@localhost:15432/livechat<br />
<br />
And finally API is accessible on: <br />
http://localhost:14000<br />

## Accounts

The application is multi-operator. By default, 2 operators are created in DB. Here's the credentials for demo:
<b>genius0212/my_password</b> and <b>genius0213/my_password</b> (username/password)

## The project

All messages are sent through Websocket (handled by the app.gateway.ts provider). Conversation are balanced through all connected and active operator.
Both operator and visitor can close conversation to "archive it".
Security is managed by a JWT token, the payload is lite (sub, exp, iat) in order to transport only necessary informations. Protected route are covered by the @UseGuards(JwtAuthGuard) decorator.