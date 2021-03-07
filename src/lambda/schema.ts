import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
type Author {
  id: Int!
  name: String!
  posts(findTitle: String): [Post]
}

type Post {
  id: Int!
  title: String!
  author: Author!
}

type Query {
  posts: [Post!]!
}
`;
