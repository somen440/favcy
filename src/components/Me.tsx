import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { MeQuery, MeQueryVariables, MeDocument } from '../generated/graphql';
import { Loading } from './Loading';
import { ErrorComponent } from './Error';

const LOGGED_IN_NAME = gql`
  query loggedInName {
    loggedInName @client
  }
`;

export function Me() {
  const { loading, error, data } = useQuery<
    MeQuery,
    MeQueryVariables
  >(MeDocument);

  if (loading) return (<Loading />);
  if (error)   return (<ErrorComponent error={error} />);

  return (
    <div>{data?.me.name}</div>
  )
}
