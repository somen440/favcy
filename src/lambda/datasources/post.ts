import { v4 as uuidv4 } from 'uuid';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Context } from "../graphql";
import * as faunadb from "faunadb";
import { Post, User } from '../../generated/graphql';

interface PostRepository {
  create(user: User, title: string, link: string): Promise<Post>
  findAll(): Promise<Post[]>
}

const q = faunadb.query;
const secret = process.env.FAUNADB_SERVER_SECRET || ''
if (secret === '') {
  throw Error('secret is empty')
}
const client = new faunadb.Client({
  secret,
});
export const postRepositoryFaunadb: PostRepository = {
  async create(user: User, title: string, link: string): Promise<Post> {
    const post: Post = {
      id: uuidv4(),
      title,
      link,
      author: user,
    }
    await client.query(q.Create(q.Ref('classes/posts'), {data: post}))
      .then((res) => console.log('success', res))
      .catch((error) => { throw new Error(error) });
    return post
  },
  async findAll(): Promise<Post[]> {
    const posts = await client.query(q.Paginate(q.Match(q.Index('all_posts'))))
      .then(({ data }: any) => {
        const getAllPostDataQuery = data.map((ref: any) => {
          return q.Get(ref)
        })
        return client.query(getAllPostDataQuery)
          .then((res: any) => {
            return Array.from(res).map(({ data }: any): Post => data)
          })
          .catch((error) => { throw new Error(error) })
      })
      .catch((error) => { throw new Error(error) })

    return posts
  },
}

export class PostAPI extends DataSource {
  context: Context;
  repo: PostRepository;

  constructor({ repo }: { repo: PostRepository }) {
    super();
    this.repo = repo
    this.context = {} as Context
  }

  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context
  }

  async create(user: User, title: string, link: string): Promise<Post> {
    return this.repo.create(user, title, link)
  }

  async findAll(): Promise<Post[]> {
    return this.repo.findAll()
  }
}
