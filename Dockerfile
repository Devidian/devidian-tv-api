# ============== build stage ==================
FROM node:16 as build-stage

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

ENV NODE_ENV=production
RUN yarn build

# ============== dependency stage =============
FROM node:16-alpine as node-modules
WORKDIR /app
COPY --from=build-stage "/app/package.json" "/app/package.json"
RUN yarn install --only=production

# ============== runtime stage ================
FROM node-modules as runtime

COPY --from=build-stage "/app/dist/" "/app/dist"
COPY --from=build-stage "/app/assets/" "/app/assets"

CMD ["yarn","start:prod"]