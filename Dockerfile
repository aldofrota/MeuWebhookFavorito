FROM node:16 as install-dependecies

WORKDIR /usr/webhook/app

COPY package.json .

RUN npm install --omit=dev --only=production

FROM node:16-alpine as builder

WORKDIR /usr/webhook/app

COPY --from=install-dependecies /usr/webhook/app/node_modules ./node_modules

COPY . .

RUN npm i -g @nestjs/cli && npm run build && npm prune --production

FROM node:16-alpine as production

ARG ENV_MODE=production
ENV NODE_ENV=${ENV_MODE}


RUN apk add --no-cache curl

WORKDIR /usr/webhook/app

COPY --from=builder /usr/webhook/app/views ./views
COPY --from=builder /usr/webhook/app/dist ./dist
COPY --from=builder /usr/webhook/app/node_modules ./node_modules

RUN chown node.node /usr/webhook/app -R

CMD [ "node", "dist/main.js"]

USER node

EXPOSE 3000
