import gql from "graphql-tag";
import { Auth0Provider } from "@auth0/auth0-react";
import { Query } from "react-apollo";

import withData from "../config";
import App from '../components/App'

const query = gql`
  query {
    todos {
      id
      name
      completed
    }
  }
`;

const Index = ({ authors }) => {
  return (
    <Auth0Provider
      domain="herokunextjsauth0.auth0.com"
      clientId="iqy45FZQ9Btr0f1J7qhd1ST23fjrIcD2"
      // TODO[localhost]
      redirectUri="http://localhost:3000/"
      audience="https://hasura-backend"
    >
      <Query // <- Wrapping the main component with Query component from react-apollo
        query={query}
        fetchPolicy={"cache-and-network"}
      >
        {({ loading, data, error }) => {
          return (
            <App loading={loading} data={data} error={error} />
          );
        }}
      </Query>
    </Auth0Provider>
  );
};

export default withData(Index);
