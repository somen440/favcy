import React, { useState } from "react";
import ReactLoading from "react-loading";

import { useQuery } from "@apollo/client";
import {
  FetchPostsDocument,
  FetchPostsQuery,
  FetchPostsQueryVariables,
} from "../generated/graphql";
import { ErrorComponent } from "./Error";
import { IconButton, Tooltip, Typography } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";

export function Posts(): JSX.Element {
  const { loading, error, data, fetchMore } = useQuery<
    FetchPostsQuery,
    FetchPostsQueryVariables
  >(FetchPostsDocument);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (loading) return <ReactLoading color="#E9A326" />;
  if (error) return <ErrorComponent error={error} />;

  if (!data?.posts) return <ReactLoading color="#E9A326" />;
  if (data.posts.length === 0) return <div>empty</div>;

  return (
    <div>
      {isLoadingMore ? (
        <ReactLoading color="#E9A326" />
      ) : (
        <div>
          <IconButton
            edge="start"
            color="inherit"
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
            <Tooltip title={`${p.author.name}` + " さんおすすめ！"}>
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
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
