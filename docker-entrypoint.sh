#!/bin/sh

cd /usr/share/nginx/html

find -type f -exec sed -i s#__appUrl__#$APP_BASE_URL#g {} +
find -type f -exec sed -i s#__apiUrl__#$API_BASE_URL#g {} +
find -type f -exec sed -i s#__revision__#$APP_REVISION#g {} +
