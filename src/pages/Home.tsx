import { gql, useQuery } from "@apollo/client";
import React from "react";

import { Posts } from "../components/Posts";
import { LoginForm } from "../components/LoginForm";
import { PostForm } from "../components/PostForm";
import { AppBar, Box, Container, Grid, makeStyles, Toolbar, Typography } from "@material-ui/core";
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { Me } from "../components/Me";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fetchButton: {
    marginRight: 36,
  },
}));

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export function HomePage(): JSX.Element {
  const classes = useStyles();
  const { data } = useQuery(IS_LOGGED_IN);
  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Favcy
          </Typography>
          {data.isLoggedIn ? <Me /> : <div />}
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <div className={classes.appBarSpacer} />
          <Box pt={4}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'あなただけの '}
              <MuiLink color="inherit" href="https://voicy.jp/">
                Voicy
              </MuiLink>{' '}
              {' と出会おう！'}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {data.isLoggedIn ? <div /> : (
                <Paper className={classes.paper}>
                  <LoginForm />
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              {data.isLoggedIn ? (
                <Paper className={classes.paper}>
                  <PostForm />
                </Paper>
              ) : <div />}
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Posts />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
