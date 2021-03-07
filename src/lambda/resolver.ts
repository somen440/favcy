import { QueryResolvers, Post, Author } from "../generated/graphql";

function dummyAuthor(): Author {
  return {} as Author;
}

function dummy(): Post[] {
  return [
    {
      id: 1,
      title: "hoge",
      author: dummyAuthor(),
    },
    {
      id: 2,
      title: "foo",
      author: dummyAuthor(),
    },
    {
      id: 3,
      title: "bar",
      author: dummyAuthor(),
    },
  ];
}

const query: QueryResolvers = {
  posts: () => dummy(),
};

export const resolvers = {
  Query: query,
};
