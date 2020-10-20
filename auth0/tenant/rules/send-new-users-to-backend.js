/* eslint-disable */
function userSyncRule(user, context, callback) {
  const auth0_id = user.user_id;
  const name = user.nickname;
  const email = user.email;

  const request = require('request');

  const mutation = `
mutation insertUser($auth0_id: String!, $name: String!, $email: String!) {
  insert_users(objects: {name: $name, auth0_id: $auth0_id, email: $email}, on_conflict: {constraint: users_auth0_id_key, update_columns: [name, email]}) {
    returning {
      id
    }
  }
}`;

  request.post(
    {
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': configuration.ACCESS_KEY,
      },
      url: configuration.HASURA_ENDPOINT,
      body: JSON.stringify({ query: mutation, variables: { auth0_id, name, email } }),
    },
    function (error, response, body) {
      console.log(body);
      callback(error, user, context);
    },
  );
}
