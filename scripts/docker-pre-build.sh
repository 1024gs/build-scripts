#!/usr/bin/env bash

npm install --production
NODE_ENV=$1 npm run build
