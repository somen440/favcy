import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type AuthPayload {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    posts(findTitle: String): [Post]!
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }

  type Query {
    me: User!
    posts: [Post!]!
  }

  type Mutation {
    login(name: String!): AuthPayload!
  }
`;
