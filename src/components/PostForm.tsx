import { useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  AddPostMutation,
  MutationAddPostArgs,
  AddPostDocument,
  FetchPostsDocument,
} from "../generated/graphql";
import { ErrorComponent } from "./Error";
import { shuffle } from "../utils/shuffle";
import { Grid, IconButton, TextField } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ReactLoading from "react-loading";

interface PostFormValues {
  title: string;
  link: string;
}

export function PostForm(): JSX.Element {
  const client = useApolloClient();

  const [addPost, { loading, error }] = useMutation<
    AddPostMutation,
    MutationAddPostArgs
  >(AddPostDocument, {
    onCompleted({ addPost }) {
      const { posts } = client.readQuery({ query: FetchPostsDocument });
      const newPosts = [...posts, addPost];
      shuffle(newPosts);
      client.writeQuery({
        query: FetchPostsDocument,
        data: { posts: newPosts },
      });
    },
  });

  const [formVar, setFormVar] = useState<PostFormValues>({
    title: "",
    link: "",
  });

  if (loading) return <ReactLoading color="#E9A326" />;
  if (error) return <ErrorComponent error={error} />;

  const setTitle = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const title = (event.target as HTMLInputElement).value;
    setFormVar({ ...formVar, title });
  };
  const setLink = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const link = (event.target as HTMLInputElement).value;
    setFormVar({ ...formVar, link });
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formVar.title === "" || formVar.link === "") {
      alert("kara");
      return;
    }
    addPost({ variables: { input: formVar } });
    setFormVar({ title: "", link: "" });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <TextField
              id="title"
              label="おすすめポイント"
              onChange={(e) => setTitle(e)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="link"
              label="放送リンク"
              onChange={(e) => setLink(e)}
            />
          </Grid>
          <Grid item>
            <IconButton type="submit" aria-label="add">
              <AddBoxIcon />
            </IconButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
