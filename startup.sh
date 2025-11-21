#!/bin/bash
pm2 serve /home/site/wwwroot/.next/static --no-daemon --spa &
node /home/site/wwwroot/.next/standalone/server.js
