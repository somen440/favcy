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
    link: String!
    author: User!
  }

  input AddPostInput {
    title: String!
    link: String!
  }

  type Query {
    me: User!
    posts: [Post!]!
  }

  type Mutation {
    login(name: String!): AuthPayload!

    addPost(input: AddPostInput!): Post!
  }
`;
