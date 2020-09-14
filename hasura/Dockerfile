FROM hasura/graphql-engine:v1.3.2

# Enable debugging mode. It should be disabled in production.
ENV HASURA_GRAPHQL_DEV_MODE=true

ENV HASURA_GRAPHQL_LOG_LEVEL=debug
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES=" startup,http-log,webhook-log,websocket-log,query-log"

# Heroku hobby tier PG has few limitations including 20 max connections
# https://devcenter.heroku.com/articles/heroku-postgres-plans#hobby-tier
ENV HASURA_GRAPHQL_PG_CONNECTIONS=15

# Change $DATABASE_URL to your heroku postgres URL if you're not using
# the primary postgres instance in your app
CMD graphql-engine \
  --database-url $DATABASE_URL \
  serve \
  --server-port $PORT
