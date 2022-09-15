FROM node:16.16.0-alpine as app

WORKDIR /opt/beabee-frontend

COPY . ./

RUN npm ci
