#!/usr/bin/env bash
set -e

source ./includes.sh

function cleanup()
{
  kill $(jobs -p)
}

trap cleanup EXIT

export HASURA_PORT=8081

if vercel whoami 2>&1 | grep "The specified token is not valid" ; then
  vercel login
fi

printf "Starting ngrok."
ngrok http --log "false" $HASURA_PORT > /dev/null &

wait_for_ngrok

# Extract the tunnel address from the ngrok API
export HASURA_PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | jq --raw-output '.tunnels  | map(select(.proto == "https" and (.config.addr | contains("'$HASURA_PORT'")))) | .[0]?.public_url')
if [ -z "$HASURA_PUBLIC_URL" ] || [ "$HASURA_PUBLIC_URL" = "null" ]; then
  echo "Unable to fetch ngrok url"
  exit 1
fi
echo "Hasura is available at $HASURA_PUBLIC_URL"

echo "Configuring and deploying auth0"
yarn configure-dev

yarn concurrently --kill-others "yarn:dev-*"
