#!/bin/sh
set -e

source includes.sh

function cleanup()
{
    cd ../hasura
    docker-compose down
}

trap cleanup EXIT

export HASURA_PORT=${HASURA_PORT:-8081} 

export AUTH0_URL="https://$(cat ../hanja-config.dev.json | jq -r '.auth0Domain')"
export ADMIN_SECRET=$(cat ../hanja-config.dev.json | jq -r '.adminSecret')
export ACTION_SECRET=$(cat ../hanja-config.dev.json | jq -r '.actionSecret')
export EVENT_SECRET=$(cat ../hanja-config.dev.json | jq -r '.eventSecret')

cd ../hasura

docker-compose up -d

# Wait for hasura to be up
wait_for_hasura

cd ../scripts

yarn hasura-local migrate apply
yarn hasura-local metadata apply

cd ../hasura
docker-compose logs -f --tail="0"
