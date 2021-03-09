import { User } from "../../generated/graphql";
import { v4 as uuidv4 } from 'uuid';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Context } from "../graphql";
import { ApolloError, AuthenticationError } from "apollo-server-errors";
import * as faunadb from "faunadb";

interface UserRepository {
  findOrUndefined(id: string): Promise<User | undefined>
  findOrUndefinedByName(name: string): Promise<User | undefined>
  create(name: string): Promise<User>
}

const q = faunadb.query;
const secret = process.env.FAUNADB_SERVER_SECRET || ''
if (secret === '') {
  throw Error('secret is empty')
}
const client = new faunadb.Client({
  secret,
});
export const userRepositoryFaunadb: UserRepository = {
  async findOrUndefined(id: string): Promise<User | undefined> {
    const data = await client.query(
      q.Get(q.Match(q.Index(`user_search_by_id`), id)),
    )
      .then(({ data }: any): User => data)
      .catch((error) => { throw new ApolloError(error) })
    return data as User
  },
  async findOrUndefinedByName(name: string): Promise<User | undefined> {
    return undefined
  },
  async create(name: string): Promise<User> {
    const user: User = {
      id: uuidv4(),
      name,
      posts: [],
    }
    await client.query(q.Create(q.Ref('classes/users'), {data: user}))
      .then((res) => console.log('success', res))
      .catch((error) => { throw new Error(error) });
    return user
  }
}

export class UserAPI extends DataSource {
  context: Context;
  repo: UserRepository;

  constructor({ repo }: { repo: UserRepository }) {
    super();
    this.repo = repo
    this.context = {} as Context
  }

  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context
  }

  async findOrUndefined(id: string): Promise<User | undefined> {
    return this.repo.findOrUndefined(id)
  }

  async findOrUndefinedByName(name: string): Promise<User | undefined> {
    return this.repo.findOrUndefinedByName(name)
  }

  async findMe(): Promise<User> {
    if (!this.context.user) {
      throw new AuthenticationError('not found user')
    }
    return this.context.user
  }

  async create(name: string): Promise<User> {
    return this.repo.create(name)
  }
}
