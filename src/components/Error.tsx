import React from "react";
import { ApolloError } from "@apollo/client";

interface ErrorComponentProps {
  error: ApolloError;
}

export function ErrorComponent(props: ErrorComponentProps): JSX.Element {
  return <div>{props.error}</div>;
}
