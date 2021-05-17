FROM node:15

WORKDIR /app

COPY . .

RUN npm i --production

EXPOSE 4444

CMD ["yarn", "start"]