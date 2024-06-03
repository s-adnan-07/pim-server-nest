FROM node:20.12.2-alpine as base
WORKDIR /usr/src/app

FROM base as deps
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --production=true --frozen-lockfile

FROM deps as build
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM base as final
ENV NODE_ENV production
USER node
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/ ./dist