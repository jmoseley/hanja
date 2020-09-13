#!/bin/sh
set -e

if [ -z "$1" ]
  then
    echo "Usage: depoly-hasura-heroku.sh app-name"; exit 1;
fi

set +e
if yarn heroku whoami ; then
  # Logged in
  echo "Already logged in"
else
  yarn heroku login
fi
set -e
yarn heroku create $1 && true
yarn heroku git:remote -a $1
yarn heroku stack:set container

read -p "Updating app, are you ready?"

yarn heroku config:set EVENT_SECRET=$EVENT_SECRET
yarn heroku config:set EVENT_ENDPOINT=$APP_URL/api/events
yarn heroku config:set ACTION_ENDPOINT=$APP_URL/api/actions
yarn heroku config:set ACTION_SECRET=$ACTION_SECRET
yarn heroku config:set HASURA_GRAPHQL_ADMIN_SECRET=$ADMIN_SECRET
#TODO[chicken before the egg]
yarn heroku config:set HASURA_GRAPHQL_JWT_SECRET='{"jwk_url": "'$AUTH0_URL'"/.well-known/jwks.json"}'
yarn heroku config:set HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous

cd ..

git push heroku master
