#!/bin/sh
set -ex

if [ -z "$1" ]
  then
    echo "Usage: depoly-hasura-heroku.sh app-name"; exit 1;
fi

yarn heroku login
yarn heroku create $1 && true
yarn heroku git:remote -a $1
yarn heroku stack:set container

read -p "Updating app, are you ready?"

yarn heroku config:set EVENT_SECRET=$EVENT_SECRET
yarn heroku config:set EVENT_ENDPOINT=$APP_URL/api/events
yarn heroku config:set ACTION_ENDPOINT=$APP_URL/api/actions
yarn heroku config:set ACTION_SECRET=$ACTION_SECRET
yarn heroku config:set HASURA_GRAPHQL_ADMIN_SECRET=$ADMIN_SECRET
#TODO[cart before the horse]
yarn heroku config:set HASURA_GRAPHQL_JWT_SECRET='{"jwk_url": "'$AUTH0_URL'"/.well-known/jwks.json"}'
yarn heroku config:set HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous

cd ..

git subtree push --prefix hasura heroku master
