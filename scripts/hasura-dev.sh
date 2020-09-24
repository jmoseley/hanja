#!/bin/sh
set -ex

export AUTH0_URL="https://$(cat ../hanja-config.dev.json | jq -r '.auth0Domain')"

cd ../hasura

docker-compose up -d

cd ../scripts

yarn hasura-local migrate apply
yarn hasura-local metadata apply
