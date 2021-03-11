import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';

import { Posts } from '../components/Posts';
import { LoginForm } from "../components/LoginForm";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export function HomePage() {
  const { data } = useQuery(IS_LOGGED_IN)
  return (
    <div>
      {data.isLoggedIn ? (
        <div>loggedin</div>
      ) : (
        <LoginForm />
      )}
      <Posts />
    </div>
  )
}
