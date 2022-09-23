#!/bin/sh

cd /usr/share/nginx/html

find -type f -exec sed -i s/__baseUrl__/$APP_BASE_URL/g {} +
find -type f -exec sed -i s/__apiUrl__/$APP_BASE_URL/g {} +
