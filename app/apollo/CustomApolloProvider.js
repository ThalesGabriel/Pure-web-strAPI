import { useMemo } from 'react'
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import ApolloClient from 'apollo-client';

const initApolloClient = (initialState = {}) => {
  const cache = new InMemoryCache().restore(initialState);

  const httpLink = createUploadLink({
    uri: `${process.env.SERVER_URL}`,
    credentials: "same-origin",
    //credentials: 'include',
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return ({
      headers: {
        ...headers
      },
    })
  });

  const client = new ApolloClient({
    ssrMode: false,
    link: authLink.concat(httpLink),
    cache,
  });
  return client;
};

let client = null;

const CustomApolloProvider = ({ apolloState, children }) => {

  client = useMemo(() => {
    return initApolloClient(client ? client.cache.extract() : {})
  }, [])

  return (
    <ApolloProvider client={client}>
      { children}
    </ApolloProvider>
  );
};

export default CustomApolloProvider;