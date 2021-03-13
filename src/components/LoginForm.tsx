import { useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { isLoggedInVar } from "../cache";

import {
  MutationLoginArgs,
  LoginDocument,
  LoginMutation,
  MeDocument,
} from "../generated/graphql";
import { ErrorComponent } from "./Error";
import { Loading } from "./Loading";

export function LoginForm(): JSX.Element {
  const [name, setName] = useState("");

  const [login, { loading, error }] = useMutation<
    LoginMutation,
    MutationLoginArgs
  >(LoginDocument, {
    onCompleted({ login: { user, token } }) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      isLoggedInVar(true);
    },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const n = (event.target as HTMLInputElement).value;
    setName(n);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name === "") {
      return;
    }
    login({ variables: { name } })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input type="text" name="name" onChange={(e) => onChange(e)} />
        <button type="submit">登録</button>
      </form>
    </div>
  );
}
