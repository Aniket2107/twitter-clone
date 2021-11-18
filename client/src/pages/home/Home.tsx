import { gql, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import AddTweet from "../../components/addTweet/AddTweet";
import ALoader from "../../components/Loader";
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
      id
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
    return (
      <div className="alignHomeLoader">
        <ALoader />
      </div>
    );
  }

  const checkProfile = () => {
    const user = JSON.parse(localStorage.getItem("twitter-user")!) || null;

    const counter = sessionStorage.getItem("twitter-counter");
    if (user && user.profile?.avatar) {
      return;
    }
    if (!counter) {
      toast.warn("Please update profile, In profile section..");
      sessionStorage.setItem("twitter-counter", "3");
    }
  };

  checkProfile();

  return (
    <div className="home">
      <AddTweet />

      {data.getTweetsByUser?.length > 0 ? (
        data.getTweetsByUser?.map((tweet: TweetType) => {
          return (
            <Tweet
              tweet={tweet}
              key={tweet.id}
              usersliked={meData.me.likedTweet}
            />
          );
        })
      ) : (
        <h3>Sorry no posts, Please follow someone or post something</h3>
      )}
    </div>
  );
}

export default Home;
