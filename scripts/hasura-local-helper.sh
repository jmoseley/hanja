#!/bin/sh
set -e

cd ../hasura


# TODO: Check for existence of hanja-config.json

export HASURA_GRAPHQL_VERSION=2
export HASURA_GRAPHQL_ENDPOINT=$(cat ../hanja-config.dev.json | jq -r '.hasuraBaseUrl')
export HASURA_GRAPHQL_ADMIN_SECRET=$(cat ../hanja-config.dev.json | jq -r '.adminSecret')

# Pass all the parameters
hasura "${@:1}"
