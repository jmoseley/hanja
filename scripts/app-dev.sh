#!/bin/sh
set -e

source includes.sh

export HASURA_ADMIN_SECRET=$(cat ../hanja-config.dev.json | jq -r '.adminSecret')
export HASURA_ENDPOINT=$(cat ../hanja-config.dev.json | jq -r '.hasuraEndpoint')
export APP_ROOT=$(cat ../hanja-config.dev.json | jq -r '.appUrl')
export ACTION_SECRET=$(cat ../hanja-config.dev.json | jq -r '.actionSecret')
export AUTH0_DOMAIN=$(cat ../hanja-config.dev.json | jq -r '.auth0Domain')

export NEXT_PUBLIC_APP_ROOT=$APP_ROOT
export NEXT_PUBLIC_HASURA_ENDPOINT=$HASURA_ENDPOINT
export NEXT_PUBLIC_HASURA_ENDPOINT=$HASURA_ENDPOINT
export NEXT_PUBLIC_APP_ROOT=$APP_ROOT
export NEXT_PUBLIC_AUTH0_DOMAIN=$AUTH0_DOMAIN
export NEXT_PUBLIC_AUTH0_CLIENT_ID=$(cat ../hanja-config.dev.json | jq -r '.auth0WebClientId')

cd ../app

wait_for_hasura

yarn generate-watch &

vercel dev
