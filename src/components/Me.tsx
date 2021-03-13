import React from "react";
import { useQuery } from "@apollo/client";
import ReactLoading from "react-loading";

import { MeQuery, MeQueryVariables, MeDocument } from "../generated/graphql";
import { ErrorComponent } from "./Error";
import { isLoggedInVar } from "../cache";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton, Typography } from "@material-ui/core";

export function Me(): JSX.Element {
  const { loading, error, data } = useQuery<MeQuery, MeQueryVariables>(
    MeDocument
  );

  if (loading) return <ReactLoading color="#E9A326" />;
  if (error) return <ErrorComponent error={error} />;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    isLoggedInVar(false);
  };

  return (
    <div>
      <Typography>
        {data?.me.name}
        <IconButton color="inherit" onClick={() => logout()}>
          <ExitToAppIcon />
        </IconButton>
      </Typography>
    </div>
  );
}
