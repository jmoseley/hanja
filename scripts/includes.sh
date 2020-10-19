wait_for_hasura() {
  printf "Waiting for hasura to start."
  until $(curl --output /dev/null --silent --fail http://localhost:$HASURA_PORT/healthz); do
    ((count=count+1))
    if [ $count -gt 15 ]; then
      echo "Failed to start hasura."
      exit 1
    fi
    sleep 5
    printf '.'
  done
  echo ''
}

wait_for_ngrok() {
  local count=0
  until $(curl --output /dev/null --silent --fail http://localhost:4040/api/); do
    ((count=count+1))
    if [ $count -gt 5 ]; then
      echo "Failed to start ngrok."
      exit 1
    fi
    sleep 2
    printf '.'
  done
  echo ''
}
