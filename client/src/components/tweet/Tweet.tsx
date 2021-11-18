import { gql, useMutation } from "@apollo/client";
import { formatDistance, subDays } from "date-fns";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { LIKED_TWEETS, TWEETS_QUERY } from "../../pages/home/Home";
import { Tw } from "../../pages/likedtweet/LikedTweet";
import { TweetType } from "../trendtweet/TrendTweet";

import "./tweet.css";

interface IProps {
  tweet: TweetType;
  usersliked: [Tw];
}

export const LIKE_TWEET_MUTATION = gql`
  mutation likeTweet($data: TweetId) {
    likeTweet(data: $data) {
      id
    }
  }
`;

export const DELETE_LIKE_MUTATION = gql`
  mutation deleteLike($data: LikedId) {
    deleteLike(data: $data) {
      id
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation addComment($data: CommentContent, $tweetId: Int!) {
    addComment(data: $data, tweetId: $tweetId) {
      content
    }
  }
`;

const Tweet: React.FC<IProps> = ({ tweet, usersliked }) => {
  const [likeloading, setLikeLoading] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [likeTweet] = useMutation(LIKE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: LIKED_TWEETS }],
  });
  const [deleteLike] = useMutation(DELETE_LIKE_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: LIKED_TWEETS }],
  });

  const [addComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: LIKED_TWEETS }],
  });

  const history = useHistory();

  const handleDislike = async () => {
    setLikeLoading(true);

    const likedTweetId = usersliked?.filter(
      (like) => like.tweet.id === tweet.id
    )[0].id;

    try {
      await deleteLike({
        variables: {
          data: {
            id: likedTweetId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Try again");
    }

    setLikeLoading(false);
  };

  const handleCreateLike = async () => {
    setLikeLoading(true);

    try {
      await likeTweet({
        variables: {
          data: {
            tweetId: tweet.id,
          },
        },
      });
    } catch (error) {
      toast.error("Something went wrong, Try again");
    }

    setLikeLoading(false);
  };

  const handleAddComment = async () => {
    if (commentContent.length < 1) {
      // alert("Invalid values");
      toast.error("Comment cannot be empty");
      return <ToastContainer />;
    }

    setCommentLoading(true);

    try {
      await addComment({
        variables: {
          data: {
            content: commentContent,
          },
          tweetId: tweet.id,
        },
      });

      setCommentContent("");
      toast.success("Comment added");
      // return <ToastContainer />
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong, Try again");
    }

    setCommentLoading(false);
  };

  const linkTweet = () => {
    history.push(`/tweet/${tweet.id}`);
  };

  return (
    <div className="tweet">
      {tweet.author?.profile?.avatar ? (
        <Link to={`/user/${tweet.author.id}`}>
          <img
            src={tweet.author.profile.avatar}
            alt="avatar"
            className="tweet_avatar"
          />
        </Link>
      ) : (
        <i
          className="fa fa-user fa-2x tweet_avatar"
          aria-hidden="true"
          style={{ border: "none" }}
        ></i>
      )}

      <div className="tweet_container">
        <div className="tweet_container_1">
          <Link to={`/user/${tweet.author.id}`} className="td-n c-000">
            <h4>{tweet.author.name}</h4>
          </Link>
          <span>
            {formatDistance(subDays(new Date(tweet.createdAt), 0), new Date())}{" "}
            ago
          </span>
        </div>

        <abbr title="Click to know more" className="td-n">
          <p onClick={linkTweet} style={{ cursor: "default" }}>
            {tweet.content ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae,impedit."}
          </p>

          {tweet.img && (
            <img
              src={tweet.img}
              alt="Tweet-img"
              className="tweet_img"
              onClick={linkTweet}
            />
          )}
        </abbr>

        <div className={`tweet_stats ${toggleComment ? "addSpace" : ""} `}>
          <div className="tweet_likes">
            {likeloading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : usersliked.map((t) => t.tweet.id).includes(tweet.id) ? (
              <i className="fa fa-heart liked" onClick={handleDislike}></i>
            ) : (
              <i className="far fa-heart" onClick={handleCreateLike}></i>
            )}

            <span>{tweet.likes?.length}</span>
          </div>
          <div className="tweet_comments">
            {/* <i className="fas fa-circle-notch fa-spin"></i> */}
            <i
              className="far fa-comment"
              onClick={() => setToggleComment(!toggleComment)}
            ></i>
            <span>{tweet.comments?.length}</span>
          </div>
        </div>
        {toggleComment && (
          <div className="tweet_usercomment">
            <input
              type="text"
              placeholder="Write you comment..."
              value={commentContent || ""}
              onChange={(e) => setCommentContent(e.target.value)}
              minLength={3}
              required
            />
            {commentLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <span onClick={handleAddComment}>Post</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweet;
