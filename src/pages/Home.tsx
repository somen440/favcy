import { gql, useQuery } from "@apollo/client";
import React from "react";

import { Posts } from "../components/Posts";
import { LoginForm } from "../components/LoginForm";
import { Me } from "../components/Me";
import { PostForm } from "../components/PostForm";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export function HomePage(): JSX.Element {
  const { data } = useQuery(IS_LOGGED_IN);
  return (
    <div>
      {data.isLoggedIn ? <Me /> : <LoginForm />}
      {data.isLoggedIn ? <PostForm /> : <div></div>}
      <Posts />
    </div>
  );
}
