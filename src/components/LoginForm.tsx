import { useApolloClient, useMutation } from "@apollo/client";
import { Button, Grid, IconButton, InputBase, makeStyles, Paper, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { isLoggedInVar } from "../cache";
import AccountCircle from '@material-ui/icons/AccountCircle';
import DoneIcon from '@material-ui/icons/Done';

import {
  MutationLoginArgs,
  LoginDocument,
  LoginMutation,
} from "../generated/graphql";
import { ErrorComponent } from "./Error";
import { Loading } from "./Loading";

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  iconButton: {
    padding: 10,
  },
}));

export function LoginForm(): JSX.Element {
  const classes = useStyles();
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <TextField
              label="名前・ニックネーム"
              onChange={(e) => onChange(e)}
            />
          </Grid>
          <Grid item>
            <IconButton type="submit" className={classes.iconButton} aria-label="login">
              <DoneIcon />
            </IconButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
