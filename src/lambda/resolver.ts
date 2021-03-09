import { AuthenticationError } from "apollo-server-errors";
import { QueryResolvers, Post, User, MutationResolvers } from "../generated/graphql";
import { DataSources } from "./graphql";
import { AuthPayload } from "../generated/graphql"
import { toBase64 } from "../utils/encoding";

function dummyAuthor(): User {
  return {} as User;
}

function dummy(): Post[] {
  return [
    {
      id: 'fff',
      title: "hoge",
      author: dummyAuthor(),
    },
    {
      id: 'bbb',
      title: "foo",
      author: dummyAuthor(),
    },
    {
      id: 'aaa',
      title: "bar",
      author: dummyAuthor(),
    },
  ];
}

const query: QueryResolvers = {
  me: (_, __, { dataSources }: { dataSources: DataSources }) => {
    return dataSources.userAPI.findMe()
  },
  posts: () => dummy(),
};

const mutation: MutationResolvers = {
  login: async (_, { name }: { name: string }, { dataSources }: { dataSources: DataSources }) => {
    let user = await dataSources.userAPI.findOrUndefinedByName(name)
    if (!user) {
      user = await dataSources.userAPI.create(name)
    }
    const token = toBase64(user.id);
    return {
      user,
      token,
    }
  }
}

export const resolvers = {
  Query: query,
  Mutation: mutation,
};
