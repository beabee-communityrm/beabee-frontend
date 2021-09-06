FROM node:14.17-alpine as app

WORKDIR /opt/beabee-frontend

COPY . ./

RUN npm install
