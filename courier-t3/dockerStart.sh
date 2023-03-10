#!/bin/bash

docker build -t courier-docker -f ./Dockerfile --build-arg  NEXT_PUBLIC_API_URL --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY .

docker run -p 3000:3000 --env-file=./.env  courier-docker

docker build -t courier-docker-t3 -f ./ct3a.dockerfile --build-arg  NEXT_PUBLIC_API_URL --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY .