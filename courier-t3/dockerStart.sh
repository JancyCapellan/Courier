#!/bin/bash

# custsom app docker build
docker build -t courier-docker -f ./Dockerfile --build-arg  NEXT_PUBLIC_API_URL --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY .
# or create t3 app example, both work
docker build -t courier-docker-t3 -f ./ct3a.dockerfile --build-arg  NEXT_PUBLIC_API_URL --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY .

docker run -p 3000:3000 --env-file=./.env  --network="host" courier-docker

#  jenkins docker
docker network create jenkins

docker run \
  --name jenkins-docker \
  --rm \
  --detach \
  --privileged \
  --network jenkins \
  --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind \
  --storage-driver overlay2

docker build -t myjenkins-blueocean:2.387.1-1 -f jenkins.dockerfile .

docker run \
  --name jenkins-blueocean \
  --restart=on-failure \
  --detach \
  --network jenkins \
  --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 \
  --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins-blueocean:2.387.1-1

# GitLab ci/cd

sudo docker run --detach \
  --publish 1443:443 --publish 8080:80 --publish 1001:22 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  --shm-size 256m \
  gitlab/gitlab-ce:latest


# Concourse Ci


# Git Hub Actions
