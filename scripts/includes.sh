wait_for_heroku() {
  printf "Waiting for heroku to start."
  until $(curl --output /dev/null --silent --fail http://localhost:8080/healthz); do
    printf '.'
    sleep 5
  done
}