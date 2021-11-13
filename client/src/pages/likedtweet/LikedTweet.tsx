import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { TweetType } from "../../components/trendtweet/TrendTweet";
import Tweet from "../../components/tweet/Tweet";
import { ME_QUERY } from "../profile/Profile";

import "./likedtweet.css";

export type Tw = {
  tweet: TweetType;
  id: string;
};

type LIKEDTWEETS = [Tw];

function LikedTweet() {
  const [likedTweets, setLikedTweets] = useState<LIKEDTWEETS | null>();

  const { loading, error, data } = useQuery(ME_QUERY);

  useEffect(() => {
    if (data) {
      setLikedTweets(data.me.likedTweet);
    }

    return () => {
      setLikedTweets(null);
    };
  }, [data]);

  if (loading || error || !likedTweets) {
    return <div className="lds-dual-ring">Loading...</div>;
  }

  return (
    <div className="likedTweets">
      <h3>Liked Tweets</h3>

      {likedTweets?.map((tw: Tw) => {
        return <Tweet tweet={tw.tweet} key={tw.id} usersliked={likedTweets} />;
      })}
    </div>
  );
}

export default LikedTweet;
