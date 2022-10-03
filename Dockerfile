FROM node:16.16.0-alpine as builder

WORKDIR /opt/beabee-frontend

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN NODE_ENV=production npx vite build

FROM nginx:1.18.0-alpine

COPY docker-entrypoint.sh /docker-entrypoint.d/30-beabee-frontend.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /opt/beabee-frontend/dist/ /usr/share/nginx/html
