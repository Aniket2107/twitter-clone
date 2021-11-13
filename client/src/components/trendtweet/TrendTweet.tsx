import { format } from "date-fns";
import React from "react";

import "./trendtweet.css";

export type TweetType = {
  id: string;
  content: string;
  createdAt: Date;
  img?: string;
  likes?: [
    {
      id: string;
    }
  ];
  comments?: [
    {
      id: string;
    }
  ];
  author: {
    id: string;
    name: string;
    profile?: {
      id: string;
      avatar?: string;
    };
  };
};

interface IProps {
  tweet: TweetType;
}

const TrendTweet: React.FC<IProps> = ({ tweet }) => {
  return (
    <div className="trendtweet">
      <div className="trendtweet_container">
        {tweet.author.profile?.avatar ? (
          <img
            src={tweet.author.profile?.avatar}
            alt="avatar"
            className="trendtweet_avatar"
          />
        ) : (
          <i
            className="fa fa-user fa-2x trendtweet_avatar"
            aria-hidden="true"
          ></i>
        )}
        <span className="trendtweet_caption">{tweet.content}</span>
        {tweet.createdAt && (
          <span>{format(new Date(tweet.createdAt), "dd/MM/yy")}</span>
        )}
      </div>
      <div className="trendtweet_stats">
        <div className="tweet_likes">
          <i className="far fa-heart"></i>
          <span>{tweet.likes?.length}</span>
        </div>
        <div className="tweet_comments">
          <i className="far fa-comment"></i>
          <span>{tweet.comments?.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TrendTweet;
