#!/bin/bash

ssh CourierServer "source ~/.nvm/nvm.sh; cd Courier/courier-t3; git checkout development;npm run build; pm2 start --name=APP npm -- start;"

# 'pm2 stop APP

# cd Courier/courier-t3

# npm run build

# pm2 start --name=APP npm -- start'