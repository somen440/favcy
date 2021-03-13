import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import {
  FetchPostsDocument,
  FetchPostsQuery,
  FetchPostsQueryVariables,
} from "../generated/graphql";
import { Loading } from "./Loading";
import { ErrorComponent } from "./Error";
import { IconButton, Typography } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";

export function Posts(): JSX.Element {
  const { loading, error, data, fetchMore } = useQuery<
    FetchPostsQuery,
    FetchPostsQueryVariables
  >(FetchPostsDocument);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;

  if (!data?.posts) return <Loading />;
  if (data.posts.length === 0) return <div>empty</div>;

  return (
    <div>
      {isLoadingMore ? (
        <Loading />
      ) : (
        <div>
          <IconButton
            edge="start"
            color="primary"
            aria-label="open drawer"
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
            <ReplayIcon />
          </IconButton>

          {data.posts.map((p) => (
            <Typography
              variant="body1"
              align="center"
              color="textSecondary"
              component="span"
            >
              <a
                key={p.title}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.title}
              </a>
              {" / "}
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
}
