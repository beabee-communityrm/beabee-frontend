FROM node:16.13-alpine as app

WORKDIR /opt/beabee-frontend

COPY . ./

RUN npm ci
