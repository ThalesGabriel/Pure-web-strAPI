FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm install --production

COPY ./ ./

RUN npm run build

RUN npm install pm2 -g

EXPOSE 3000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]