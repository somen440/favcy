import {
  QueryResolvers,
  User,
  MutationResolvers,
  AuthPayload,
  Post,
  AddPostInput,
} from "../generated/graphql";
import { DataSources } from "./graphql";
import { toBase64 } from "../utils/encoding";
import { AuthenticationError, ValidationError } from "apollo-server-errors";
import { shuffle } from "../utils/shuffle";

interface ResolversContext {
  user: User | undefined;
  dataSources: DataSources;
}

const query: QueryResolvers = {
  me: (_, __, { user }: { user: User | undefined }) => {
    if (!user) {
      throw new AuthenticationError("");
    }
    return user;
  },
  posts: async (_, __, { dataSources }: ResolversContext) => {
    const maxLen = 100;
    const posts = await dataSources.postAPI.findAll();
    return shuffle(posts).slice(0, Math.min(posts.length, maxLen));
  },
};

interface LoginArgs {
  name: string;
}
interface AddPostArgs {
  input: AddPostInput;
}
const mutation: MutationResolvers = {
  login: async (
    _,
    { name }: LoginArgs,
    { dataSources }: ResolversContext
  ): Promise<AuthPayload> => {
    let user = await dataSources.userAPI.findOrUndefinedByName(name);
    if (!user) {
      user = await dataSources.userAPI.create(name);
    }
    const token = toBase64(user.id);
    return {
      user,
      token,
    };
  },
  addPost: async (
    _,
    { input: { title, link } }: AddPostArgs,
    { user, dataSources }: ResolversContext
  ): Promise<Post> => {
    if (!user) {
      throw new AuthenticationError("not found user");
    }
    if (!link.startsWith("https://voicy.jp/")) {
      throw new ValidationError("invalid link");
    }
    return dataSources.postAPI.create(user, title, link);
  },
};

export const resolvers = {
  Query: query,
  Mutation: mutation,
};
