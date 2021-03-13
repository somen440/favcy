import 'fontsource-roboto';
import * as React from 'react';

import { ApolloProvider, ApolloClient } from '@apollo/client';
import { HomePage } from "./pages/Home";
import { cache } from "./cache"

let token = localStorage.getItem('token') || ""
if (token !== "") {
  token = `bearer ${token}`
}
const client = new ApolloClient({
  cache,
  uri: "/.netlify/functions/graphql",
  headers: {
    authorization: token,
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
