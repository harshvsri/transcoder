FROM node:20-alpine

RUN apk add --no-cache ffmpeg

USER node

WORKDIR /home/node/transcoder

COPY --chown=node package*.json ./

RUN npm ci

COPY --chown=node . .

RUN npm run build

EXPOSE 80

CMD [ "npm", "start" ]

