import * as React from 'react';

import { ApolloProvider, ApolloClient } from '@apollo/client';
import { HomePage } from "./pages/Home";
import { cache } from "./cache"

const client = new ApolloClient({
  cache,
  uri: "/.netlify/functions/graphql",
  headers: {
    authorization: `bearer ${localStorage.getItem('token')}` || "",
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <HomePage />
    </ApolloProvider>
  )
}

export default App
