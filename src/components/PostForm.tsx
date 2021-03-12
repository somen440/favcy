import { useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { AddPostMutation, MutationAddPostArgs, AddPostDocument, FetchPostsDocument } from '../generated/graphql';
import { ErrorComponent } from './Error';
import { Loading } from './Loading';
import { shuffle } from "../utils/shuffle"

interface PostFormValues {
  title: string
  link: string
}

export function PostForm() {
  const client = useApolloClient()

  const [addPost, { loading, error }] = useMutation<
    AddPostMutation,
    MutationAddPostArgs
  >(
    AddPostDocument,
    {
      onCompleted({ addPost }) {
        const { posts } = client.readQuery({ query: FetchPostsDocument })
        const newPosts = [...posts, addPost];
        shuffle(newPosts);
        client.writeQuery({ query: FetchPostsDocument, data: { posts: newPosts } });
      }
    }
  );

  const [formVar, setFormVar] = useState<PostFormValues>({title: "", link: ""})

  if (loading) return <Loading />
  if (error) return <ErrorComponent error={error} />

  const setTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = (event.target as HTMLInputElement).value
    setFormVar({...formVar, title})
  };
  const setLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    const link = (event.target as HTMLInputElement).value
    setFormVar({...formVar, link})
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formVar.title === "" || formVar.link === "") {
      alert("kara");
      return
    }
    addPost({ variables: { input: formVar } })
    setFormVar({title: "", link: ""})
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="title"
          onChange={(e) => setTitle(e)}
        />
        <input
          type="text"
          name="link"
          onChange={(e) => setLink(e)}
        />
        <button>+</button>
      </form>
    </div>
  )
}
