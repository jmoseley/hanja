#!/bin/sh
set -e

cd ../

if vercel whoami 2>&1 | grep "The specified token is not valid" ; then
  vercel login
else
  # Logged in
  echo "Already logged in to Vercel"
fi

OPTS="--prod --local-config $VERCEL_CONFIG_FILE -b HASURA_ENDPOINT=$HASURA_ENDPOINT -b HASURA_ADMIN_SECRET=$HASURA_ADMIN_SECRET"

# If .vercel folder does not exist, allow opportunity for project to be linked, otherwise just quick deploy
if [ -d "app/.vercel" ]; then
  vercel $OPTS --confirm ./app
else
  vercel $OPTS --confirm --name $PROJECT_SLUG ./app
fi
