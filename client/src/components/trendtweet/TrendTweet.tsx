import { gql, useMutation } from "@apollo/client";
import { format } from "date-fns";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { TWEETS_QUERY } from "../../pages/home/Home";
import { ME_QUERY } from "../../pages/profile/Profile";
import Modal from "react-modal";

import "./trendtweet.css";
import { editCustomStyle } from "./style";

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
  update?: boolean;
}

const DELETE_TWEET_MUTATION = gql`
  mutation deleteTweet($tweetId: Int) {
    deleteTweet(tweetId: $tweetId) {
      content
    }
  }
`;

const UPDATE_TWEET_MUTATION = gql`
  mutation updateTweet($tweetId: Int, $content: String) {
    updateTweet(tweetId: $tweetId, content: $content) {
      content
    }
  }
`;

const TrendTweet: React.FC<IProps> = ({ tweet, update }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updatedTweet, setUpdatedTweet] = useState(tweet.content);

  const [deleteTweet] = useMutation(DELETE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: ME_QUERY }],
  });
  const [updateTweet] = useMutation(UPDATE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: ME_QUERY }],
  });

  const history = useHistory();

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const linkTweet = () => {
    history.push(`/tweet/${tweet.id}`);
  };

  const handelUpdateTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateTweet({
        variables: {
          tweetId: tweet.id,
          content: updatedTweet,
        },
      });

      toast.success("Tweet updated");
      setIsOpen(false);
      // window.location.reload();
    } catch (error) {
      toast.error("Something went wrong, Try again");
    }
  };

  const handledeleteTweet = async () => {
    let conf = window.confirm("Are you sure you want to delete?");
    if (conf) {
      try {
        await deleteTweet({
          variables: {
            tweetId: tweet.id,
          },
        });

        toast.success("Tweet deleted");
      } catch (error) {
        toast.error("Something went wrong, Try again");
      }
    }
  };

  return (
    <div className="trendtweet cp">
      <div className="trendtweet_container" onClick={linkTweet}>
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
            style={{ border: "none" }}
          ></i>
        )}
        <span className="trendtweet_caption">{tweet.content}</span>
        {tweet.createdAt && (
          <span>{format(new Date(tweet.createdAt), "dd/MM/yy")}</span>
        )}
      </div>
      <div className="trendtweet_stats" onClick={linkTweet}>
        <div className="tweet_likes">
          <i className="far fa-heart"></i>
          <span>{tweet.likes?.length}</span>
        </div>
        <div className="tweet_comments">
          <i className="far fa-comment"></i>
          <span>{tweet.comments?.length}</span>
        </div>
      </div>

      {update && (
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Modal"
          style={editCustomStyle}
          ariaHideApp={false}
        >
          <form onSubmit={handelUpdateTweet} className="form-control">
            <input
              type="text"
              value={updatedTweet}
              onChange={(e) => setUpdatedTweet(e.target.value)}
              required
              minLength={2}
            />
            <button type="submit" className="trend__tweet__editBtn">
              <i className="fas fa-edit" style={{ color: "#047aed" }}></i>
            </button>
          </form>
        </Modal>
      )}

      {update && (
        <div className="trendtweet_update">
          <i
            className="fas fa-edit"
            style={{ color: "#047aed" }}
            onClick={openModal}
          ></i>
          <i
            className="fas fa-trash"
            style={{ color: "red" }}
            onClick={handledeleteTweet}
          ></i>
        </div>
      )}
    </div>
  );
};

export default TrendTweet;
