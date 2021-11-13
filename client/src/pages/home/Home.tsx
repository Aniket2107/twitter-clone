import { gql, useQuery } from "@apollo/client";
import AddTweet from "../../components/addTweet/AddTweet";
import { TweetType } from "../../components/trendtweet/TrendTweet";
import Tweet from "../../components/tweet/Tweet";

import "./home.css";

export const TWEETS_QUERY = gql`
  query TWEETS_QUERY {
    getTweetsByUser {
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

export const LIKED_TWEETS = gql`
  query me {
    me {
      name
      likedTweet {
        id
        tweet {
          id
          content
          img
          createdAt
          author {
            id
            name
            profile {
              id
              avatar
            }
          }
          likes {
            id
          }
          comments {
            id
          }
        }
      }
    }
  }
`;

function Home() {
  const { loading, error, data } = useQuery(TWEETS_QUERY);
  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(LIKED_TWEETS);

  if (loading || meLoading || error || meError) {
    return <div className="lds-dual-ring">Loading...</div>;
  }

  return (
    <div className="home">
      <AddTweet />

      {data.getTweetsByUser?.map((tweet: TweetType) => {
        return (
          <Tweet
            tweet={tweet}
            key={tweet.id}
            usersliked={meData.me.likedTweet}
          />
        );
      })}
    </div>
  );
}

export default Home;
