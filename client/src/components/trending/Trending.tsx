import { gql, useQuery } from "@apollo/client";
import TrendTweet, { TweetType } from "../trendtweet/TrendTweet";

import "./trending.css";

export const ALL_TWEETS_QUERY = gql`
  query tweets {
    tweets {
      id
      createdAt
      content
      img
      likes {
        id
      }
      comments {
        id
      }
      author {
        id
        name
        profile {
          id
          avatar
        }
      }
    }
  }
`;

function Trending() {
  const { loading, error, data } = useQuery(ALL_TWEETS_QUERY);

  if (loading || error) {
    return <div className="">loading...</div>;
  }

  const getPopularTweets = data?.tweets
    ?.map((tweet: TweetType) => tweet)
    .sort((a: TweetType, b: TweetType) => {
      if (a.likes && b.likes) {
        return b.likes.length - a.likes.length;
      }
      return -1;
    })
    .slice(0, 6);

  return (
    <div className="trending">
      <h3>Trending</h3>
      {getPopularTweets &&
        getPopularTweets?.map((tweet: TweetType) => {
          return <TrendTweet tweet={tweet} key={tweet.id} />;
        })}
    </div>
  );
}

export default Trending;
