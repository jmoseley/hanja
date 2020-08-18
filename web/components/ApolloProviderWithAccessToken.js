import React, { useState, useEffect } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from 'apollo-boost';
import { useAuth0 } from '@auth0/auth0-react';


const ApolloProviderWithAccessToken = props => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently({
                audience: 'https://hasura.demo.com/v1/graphql'
            }).then(at => {
                console.log('at', at);
                if (at) {
                    setAccessToken(at);
                }
            }).catch(err => console.error(err));
        }
    }, [isAuthenticated]);

    console.log('accessToken', accessToken);

    // TODO: Is it crazy to reinstantiate this everytime?
    const client = new ApolloClient({
        uri: "http://localhost:8080/v1/graphql",
        request: operation => {
            if (accessToken !== '') {
                operation.setContext({
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    }
                });
            }
        }
    });

    return (
        <ApolloProvider client={client}>
            {props.children}
        </ApolloProvider>
    );
}

export default ApolloProviderWithAccessToken;