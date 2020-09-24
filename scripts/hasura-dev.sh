#!/bin/sh
set -ex

export AUTH0_URL="https://$(cat ../hanja-config.dev.json | jq -r '.auth0Domain')"
export ADMIN_SECRET=$(cat ../hanja-config.dev.json | jq -r '.adminSecret')
export ACTION_SECRET=$(cat ../hanja-config.dev.json | jq -r '.actionSecret')
export EVENT_SECRET=$(cat ../hanja-config.dev.json | jq -r '.eventSecret')

cd ../hasura

docker-compose up -d

cd ../scripts

yarn hasura-local migrate apply
yarn hasura-local metadata apply
