FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4000 80

CMD ["npm", "run", "start:dev"]