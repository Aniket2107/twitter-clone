import { useQuery } from "@apollo/client";
import ALoader from "../../components/Loader";
import { TweetType } from "../../components/trendtweet/TrendTweet";
import Tweet from "../../components/tweet/Tweet";
import { ME_QUERY } from "../profile/Profile";

import "./likedtweet.css";

export type Tw = {
  tweet: TweetType;
  id: string;
};

function LikedTweet() {
  const { loading, error, data } = useQuery(ME_QUERY);

  if (loading || error) {
    return (
      <div className="alignHomeLoader">
        <ALoader />
      </div>
    );
  }

  return (
    <div className="likedTweets">
      <h3>Liked Tweets</h3>

      {data.me.likedTweet.length > 0 ? (
        data.me.likedTweet.map((tw: Tw) => {
          return (
            <Tweet
              tweet={tw.tweet}
              key={tw.id}
              usersliked={data.me.likedTweet}
            />
          );
        })
      ) : (
        <p>Sorry you do not have any likedTweets</p>
      )}
    </div>
  );
}

export default LikedTweet;
