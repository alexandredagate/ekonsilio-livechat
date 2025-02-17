FROM node:22-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY . ./

RUN ["npm", "install"]

EXPOSE 4000 80

ENTRYPOINT ["/bin/sh", "-c", "npm run migration:run && npm run start:dev" ]