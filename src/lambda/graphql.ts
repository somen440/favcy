import 'idempotent-babel-polyfill';
import { AuthenticationError, ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";
import { UserAPI, userRepositoryFaunadb } from "./datasources/user"
import { User } from "../generated/graphql";
import { fromBase64 } from "../utils/encoding";

export interface DataSources {
  userAPI: UserAPI
}
const repo = userRepositoryFaunadb
const dataSources = () => ({
  userAPI: new UserAPI({repo}),
})

export interface Context {
  user: User | undefined
}
const context: ContextFunction = async (req): Promise<Context> => {
  const auth: string = (req.event.headers && req.event.headers.authorization) || '';
  if (auth === '') {
    return { user: undefined }
  }
  if (auth.split(' ')[0].toLowerCase() !== 'bearer') {
    throw new AuthenticationError('invalid token')
  }

  const id = fromBase64(auth.split(' ')[1])
  console.log(`id=${id}`);
  return {
    user: await repo.findOrUndefined(id)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources,
  introspection: true,
  playground: true,
});

exports.handler = server.createHandler();
