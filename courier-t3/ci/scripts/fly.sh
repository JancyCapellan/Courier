#!/bin/bash

# if [ $# -eq 0 ];
# then
#   echo "$0: Missing arguments"
#   exit 1
# elif [ $# -gt 2 ];
# then
#   echo "$0: Too many arguments: $@"
#   exit 1
# else
#   echo "We got some argument(s)"
#   echo "==========================="
#   echo "Number of arguments.: $#"
#   echo "List of arguments...: $@"
#   echo "Arg #1..............: $1"
#   echo "Arg #2..............: $2"
#   echo "==========================="
# fi

# echo "And then we do something with $1 $2"


#  get ssh key
file=~/.ssh/id_ed25519
key=$(<"$file")
# echo $key

# create pull-repo pipeline
if fly -t tutorial set-pipeline -p build-prod -c ./tasks/buildProd.yml -v private_key="$key" ; then
  fly -t tutorial trigger-job --job build-prod/build-prod --watch
else
  echo "ERROR"
fi
