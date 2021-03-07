import React, { useState } from 'react';

import { useQuery } from '@apollo/client';
import { FetchPostsDocument, FetchPostsQuery, FetchPostsQueryVariables } from '../generated/graphql';
import { Loading } from "./Loading";
import { ErrorComponent } from "./Error";

export function Posts() {
  const { loading, error, data, fetchMore } = useQuery<
    FetchPostsQuery,
    FetchPostsQueryVariables
  >(FetchPostsDocument);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (loading) return (<Loading />);
  if (error)   return (<ErrorComponent error={error} />);

  if (!data?.posts)            return (<Loading />);
  if (data.posts.length === 0) return (<div>empty</div>);

  return (
    <div>
      {isLoadingMore
        ? <Loading />
        : (
        <div>
          {data.posts.map(p => (
            <p>{p.title}</p>
          ))}
          <button
            onClick={async () => {
              setIsLoadingMore(true);
              await fetchMore({
                variables: {
                  after: data,
                },
              });
              setIsLoadingMore(false);
            }}
          >
            fetch
          </button>
        </div>)
      }
    </div>
  )
}
