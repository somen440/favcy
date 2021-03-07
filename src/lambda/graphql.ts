import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

exports.handler = server.createHandler();
