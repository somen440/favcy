import * as React from 'react';
import "./App.css"

import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const GET_GREETING = gql`
  query {
    hello
  }
`;
function LambdaDemo() {
  const { loading, error, data } = useQuery(GET_GREETING);

  if (loading) return (<div>loading</div>);
  if (error)   return (<div>{error}</div>);

  return (
    <div>
      A greeting from the server: {data.hello}
    </div>
  )
}

const client = new ApolloClient({
  uri: "/.netlify/functions/graphql",
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
      <LambdaDemo />
    </ApolloProvider>
  )
}

export default App
