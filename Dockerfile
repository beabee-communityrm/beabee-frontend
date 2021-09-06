FROM node:14.17-alpine as app

RUN npm install -g npm@7

WORKDIR /opt/beabee-frontend

COPY . ./

RUN npm install

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080
