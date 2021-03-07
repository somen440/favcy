import * as React from 'react';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Posts } from './components/Posts';

const client = new ApolloClient({
  uri: "/.netlify/functions/graphql",
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
      <Posts />
    </ApolloProvider>
  )
}

export default App
