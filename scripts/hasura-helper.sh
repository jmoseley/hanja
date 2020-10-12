#!/bin/sh
set -e

cd ../hasura


# TODO: Check for existence of hanja-config.json

export HASURA_GRAPHQL_VERSION=2
export HASURA_GRAPHQL_ENDPOINT=$(cat ../hanja-config.prod.json | jq -r '.hasuraBaseUrl')
export HASURA_GRAPHQL_ADMIN_SECRET=$(cat ../hanja-config.prod.json | jq -r '.adminSecret')
# HASURA_GRAPHQL_ACTIONS_HANDLER_WEBHOOK_BASEURL=$(cat ../hanja-config.json | jq -r '.hasuraEndpoint')

# Pass all the parameters
hasura "${@:1}"
