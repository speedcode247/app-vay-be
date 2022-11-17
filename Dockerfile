FROM node:14-alpine

WORKDIR /usr/app

RUN npm install pm2 --global

COPY ./package.json ./

RUN npm install --production

COPY . .

ENV NODE_ENV production