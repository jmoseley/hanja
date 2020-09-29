#!/bin/sh
set -e

cd ../

# TODO: Figure out why this does not work when building with vercel. We shouldn't have to do this first.
cd ./app
yarn generate
cd ..

if vercel whoami 2>&1 | grep "The specified token is not valid" ; then
  vercel login
else
  # Logged in
  echo "Already logged in to Vercel"
fi

LOCAL_OPTS="--local-config $VERCEL_CONFIG_FILE"
OPTS="--prod $LOCAL_OPTS -b HASURA_ENDPOINT=$HASURA_ENDPOINT -b HASURA_ADMIN_SECRET=$HASURA_ADMIN_SECRET"

if [ -n "$DOMAIN_NAME" ]; then
  echo "Setting domain alias"
  if [ -z "$(vercel domains ls $LOCAL_OPTS 2>&1 | grep $DOMAIN_NAME)" ]; then
    echo "Domain not registered to account, adding"
    vercel domains add $DOMAIN_NAME $PROJECT_SLUG $LOCAL_OPTS
  fi
fi

# If .vercel folder does not exist, allow opportunity for project to be linked, otherwise just quick deploy
if [ -d "app/.vercel" ]; then
  vercel $OPTS --confirm ./app
else
  vercel $OPTS --confirm --name $PROJECT_SLUG ./app
fi
