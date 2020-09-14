#!/bin/sh
set -e

if [ -z "$HEROKU_PROJECT_NAME" ]
  then
    echo "Must specify app name as HEROKU_PROJECT_NAME"; exit 1;
fi

cd ..

yarn

set +e
if yarn heroku whoami ; then
  # Logged in
  echo "Already logged in to Heroku"
else
  yarn heroku login
fi
set -e
# TODO: Use manifest for app definition. Was not able to get this to work.
yarn heroku apps:create -s container --addons=heroku-postgresql $HEROKU_PROJECT_NAME && true
yarn heroku git:remote -a $HEROKU_PROJECT_NAME

read -p "Updating app, are you ready?"

# TODO: Use .env
yarn heroku config:set EVENT_SECRET=$EVENT_SECRET
yarn heroku config:set EVENT_ENDPOINT=$APP_URL/api/events
yarn heroku config:set ACTION_ENDPOINT=$APP_URL/api/actions
yarn heroku config:set ACTION_SECRET=$ACTION_SECRET
yarn heroku config:set HASURA_GRAPHQL_ADMIN_SECRET=$ADMIN_SECRET
#TODO[chicken before the egg]
yarn heroku config:set HASURA_GRAPHQL_JWT_SECRET='{"jwk_url": "'$AUTH0_URL'"/.well-known/jwks.json"}'
yarn heroku config:set HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous

git push heroku $(git rev-parse --abbrev-ref HEAD):master
