#!/bin/sh
set -e

cd ..

yarn

if [ -n "$HEROKU_TEAM" ]; then
  TEAM_OPTS="--team=$HEROKU_TEAM"
fi

set +e
if yarn heroku whoami ; then
  # Logged in
  echo "Already logged in to Heroku"
else
  yarn heroku login
fi
set -e
# TODO: Use manifest for app definition. Was not able to get this to work.
yarn heroku apps:create -s container $TEAM_OPTS --addons=heroku-postgresql $PROJECT_SLUG && true
yarn heroku git:remote -a $PROJECT_SLUG

# TODO: Use .env
yarn heroku config:set EVENT_SECRET=$EVENT_SECRET
yarn heroku config:set EVENT_ENDPOINT=$APP_URL/api/events
yarn heroku config:set ACTION_ENDPOINT=$APP_URL/api/actions
yarn heroku config:set ACTION_SECRET=$ACTION_SECRET
yarn heroku config:set HASURA_GRAPHQL_ADMIN_SECRET=$ADMIN_SECRET
yarn heroku config:set HASURA_GRAPHQL_JWT_SECRET='{ "jwk_url": "'$AUTH0_URL'/.well-known/jwks.json" }'
yarn heroku config:set HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous

if [ -n "$DOMAIN_NAME" ]; then
  echo "Setting domain alias"
  if [ -z "$(heroku domains -a $PROJECT_SLUG 2>&1 | grep $DOMAIN_NAME)" ]; then
    echo "Domain not registered to account, adding"
    heroku domains:add -a $PROJECT_SLUG $DOMAIN_NAME
  fi
fi

git push heroku $(git rev-parse --abbrev-ref HEAD):master

HASURA_ENDPOINT=$(yarn heroku apps:info | grep "Web URL" | cut -d":" -f2,3 | sed 's/^ *//g')

cd hasura

echo "Applying migrations"
hasura migrate apply --endpoint $HASURA_ENDPOINT --admin-secret $ADMIN_SECRET
hasura metadata apply --endpoint $HASURA_ENDPOINT --admin-secret $ADMIN_SECRET
