FROM node:22

WORKDIR /app

COPY . ./

RUN ["npm", "install"]

EXPOSE 5173

ENTRYPOINT ["/bin/sh", "-c", "npm run dev -- --host" ]