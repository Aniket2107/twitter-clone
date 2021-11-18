import { gql, useMutation, useQuery } from "@apollo/client";
import { formatDistance, subDays } from "date-fns";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  CREATE_COMMENT_MUTATION,
  DELETE_LIKE_MUTATION,
  LIKE_TWEET_MUTATION,
} from "../../components/tweet/Tweet";
import { LIKED_TWEETS, TWEETS_QUERY } from "../home/Home";

import "../../components/tweet/tweet.css";
import "./tweeet.css";
import { toast, ToastContainer } from "react-toastify";
import { Tw } from "../likedtweet/LikedTweet";

interface ParamType {
  id: string;
}

export const TWEET_QUERY = gql`
  query tweet($tweetId: Int) {
    tweet(tweetId: $tweetId) {
      id
      content
      createdAt
      img
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
        content
        createdAt
        user {
          id
          name
          profile {
            id
            avatar
          }
        }
      }
    }
  }
`;

interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    profile: {
      id: number;
      avatar: string;
    };
  };
}

const Tweeet = () => {
  const { id } = useParams<ParamType>();
  const [likeloading, setLikeLoading] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const { loading, error, data } = useQuery(TWEET_QUERY, {
    variables: { tweetId: parseInt(id) },
  });

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(LIKED_TWEETS);

  const [likeTweet] = useMutation(LIKE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: LIKED_TWEETS }],
  });
  const [deleteLike] = useMutation(DELETE_LIKE_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: LIKED_TWEETS }],
  });

  const [addComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: LIKED_TWEETS }],
  });

  if (loading || error || meLoading || meError) {
    return <div className="lds-dual-ring">Loading...</div>;
  }

  const tweet = data.tweet;

  const usersliked: [Tw] = meData.me.likedTweet;

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
      alert("Something went wrong, Try again");
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
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong, Try again");
    }

    setCommentLoading(false);
  };

  return (
    <div className="tweeet">
      <div className="tweet">
        {tweet.author?.profile?.avatar ? (
          <img
            src={tweet.author.profile.avatar}
            alt="avatar"
            className="tweet_avatar"
          />
        ) : (
          <i className="fa fa-user fa-2x tweet_avatar" aria-hidden="true"></i>
        )}

        <div className="tweet_container">
          <div className="tweet_container_1">
            <h4>{tweet.author.name}</h4>
            <span>
              {formatDistance(
                subDays(new Date(tweet.createdAt), 0),
                new Date()
              )}{" "}
              ago
            </span>
          </div>

          <p>
            {tweet.content ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae,impedit."}
          </p>

          {tweet.img && (
            <img src={tweet.img} alt="Tweet-img" className="tweet_img" />
          )}

          <div className={`tweet_stats`}>
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
              <i
                className="far fa-comment"
                onClick={() => setToggleComment(!toggleComment)}
              ></i>
              <span>{tweet.comments?.length}</span>
            </div>
          </div>

          {toggleComment && (
            <div className="tweeet_usercomment">
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

          <div className="tweeet_comments">
            <p className="tweeet_heading">{tweet.comments?.length} Comments</p>

            {tweet.comments.map((cmt: CommentType) => {
              return (
                <div className="tweeet_comment" key={cmt.id}>
                  <img
                    src={cmt.user.profile?.avatar}
                    alt="avatar"
                    className="tweeet_avatar"
                  />

                  <div className="">
                    <p>{cmt.user.name}</p>
                    <span className="tweeet_content">{cmt.content}</span>
                  </div>

                  <span className="tweeet_comment_date">
                    {formatDistance(
                      subDays(new Date(cmt.createdAt), 0),
                      new Date()
                    )}{" "}
                    ago
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweeet;
