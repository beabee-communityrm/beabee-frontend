#!/bin/sh

cd /usr/share/nginx/html

find -type f -exec sed -i s#__appUrl__#$APP_BASE_URL#g {} +
find -type f -exec sed -i s#__apiUrl__#$API_BASE_URL#g {} +
find -type f -exec sed -i s#__revision__#$APP_REVISION#g {} +
find -type f -exec sed -i s#__appsignalKey__#$APPSIGNAL_KEY#g {} +
find -type f -exec sed -i s#__cnrMode__#$CNR_MODE#g {} +
