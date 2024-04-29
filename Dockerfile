FROM node:20.12.2

WORKDIR /usr/src/pim-server-nest

COPY package.json yarn.lock /usr/src/pim-server-nest/

RUN yarn

COPY . .

# EXPOSE $PORT

RUN yarn build

RUN rm -rf ./src

# CMD ["yarn", "start:prod"]