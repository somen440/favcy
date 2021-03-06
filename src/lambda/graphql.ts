import "idempotent-babel-polyfill";
import { AuthenticationError, ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";
import { UserAPI, userRepositoryFaunadb } from "./datasources/user";
import { PostAPI, postRepositoryFaunadb } from "./datasources/post";
import { User } from "../generated/graphql";
import { fromBase64 } from "../utils/encoding";

export interface DataSources {
  userAPI: UserAPI;
  postAPI: PostAPI;
}
const repo = userRepositoryFaunadb;
const dataSources = () => ({
  userAPI: new UserAPI({ repo: userRepositoryFaunadb }),
  postAPI: new PostAPI({ repo: postRepositoryFaunadb }),
});

export interface Context {
  user: User | undefined;
}
const context: ContextFunction = async (req): Promise<Context> => {
  const auth: string =
    (req.event.headers && req.event.headers.authorization) || "";
  console.log(auth);
  if (auth === "") {
    return { user: undefined };
  }
  if (auth.split(" ")[0].toLowerCase() !== "bearer") {
    throw new AuthenticationError("invalid token");
  }

  const id = fromBase64(auth.split(" ")[1]);
  const user = await repo.find(id);
  console.log(`id=${id} user=${user.name}`);
  return {
    user,
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources,
  introspection: true,
  playground: true,
});

exports.handler = server.createHandler();
