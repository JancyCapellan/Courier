#!/bin/bash

if [ $# -eq 0 ];
then
  echo "$0: Missing arguments"
  exit 1


echo $1

# ssh -i $1 CourierServer "source ~/.nvm/nvm.sh; cd Courier/courier-t3; git checkout development; git pull; npm run build; "

# 'pm2 stop APP

# cd Courier/courier-t3

# npm run build

# pm2 start --name=APP npm -- start'

# pull, build and start with pm2
# ssh CourierServer 'source ~/.nvm/nvm.sh; ./pullStart.sh'