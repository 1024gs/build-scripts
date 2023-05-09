#!/usr/bin/env bash

docker stop sg-ui
docker rm sg-ui
docker rmi -f sg-ui-image
docker build --build-arg NODE_ENV=$1 -t sg-ui-image -f scripts/docker-Dockerfile .

docker run -e "NODE_ENV=$1" -d -p 8101:8080 -m 1G --name sg-ui sg-ui-image
