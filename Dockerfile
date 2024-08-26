FROM node:20-alpine

RUN apk add --no-cache ffmpeg

USER node

WORKDIR /home/node/transcoder

COPY --chown=node package*.json ./

RUN npm ci

COPY --chown=node . .

RUN node -v && npm -v && ffmpeg -h

CMD [ "npm", "run", "dev" ]

