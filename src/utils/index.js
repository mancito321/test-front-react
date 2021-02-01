import { ApolloClient, InMemoryCache } from '@apollo/client';
//Set up gql uri to the port 8082
const client = new ApolloClient({
    uri: 'http://192.168.1.56:8082/graphql',
    cache: new InMemoryCache()
});

export default client