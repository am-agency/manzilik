#!/bin/bash

STAGE=$1

FILE=.env
if [ -f "$FILE" ]; then
    echo "Don't terminate this process, unless you excally aware of the consequences."
else
  echo "File .env is not exists"
  exit 1
fi

# Deploy
aws s3 sync build/ s3://manz-"$STAGE".manzilik.com --acl public-read
