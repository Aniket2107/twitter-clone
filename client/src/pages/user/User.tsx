import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";

import "../profile/profile.css";
import TrendTweet, { TweetType } from "../../components/trendtweet/TrendTweet";

export const USER_QUERY = gql`
  query userById($userId: Int!) {
    userById(userId: $userId) {
      id
      name
      email
      profile {
        id
        avatar
        website
        bio
      }
      following {
        id
      }
      tweets {
        id
        content
        createdAt
        img
        likes {
          id
        }
        comments {
          id
        }
        author {
          name
          id
          profile {
            id
            avatar
          }
        }
      }
      likedTweet {
        id
      }
    }
  }
`;

export const ME_FOLLOWS = gql`
  query me {
    me {
      id
      email
      following {
        id
        followId
      }
    }
  }
`;

const DELETE_FOLLOW_USER_QUERY = gql`
  mutation unFollow($followId: Int) {
    unFollow(followId: $followId) {
      id
    }
  }
`;

const FOLLOW_USER_QUERY = gql`
  mutation follow($data: Follow) {
    follow(data: $data) {
      id
    }
  }
`;

interface ParamType {
  id: string;
}

interface FollowerIds {
  followId: number;
  id: number;
}

const User = () => {
  const { id } = useParams<ParamType>();

  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { userId: parseInt(id) },
  });

  const [follow] = useMutation(FOLLOW_USER_QUERY, {
    refetchQueries: [{ query: ME_FOLLOWS }],
  });

  const [unFollow] = useMutation(DELETE_FOLLOW_USER_QUERY, {
    refetchQueries: [{ query: ME_FOLLOWS }],
  });

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(ME_FOLLOWS);

  const [followLoading, setFollowLoading] = useState(false);

  if (loading || meLoading || error || meError) {
    return <div className="lds-dual-ring">Loading...</div>;
  }

  // console.log(data, meData);

  if (data.userById.email === meData.me.email) {
    return <Redirect to="/profile" />;
  }

  const idOfFollowers = meData.me.following?.map(
    (follow: FollowerIds) => follow.followId
  );
  const follows = meData.me.following?.map((follow: FollowerIds) => follow);

  const getFollowId = follows.filter(
    (follow: any) => follow.followId === data.userById.id
  );

  const handleFollow = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setFollowLoading(true);

    try {
      await follow({
        variables: {
          data: {
            followId: data.userById.id,
            name: data.userById.name,
            avatar: data.userById.profile.avatar,
          },
        },
      });
    } catch (error) {
      alert("Something went wrong, Try again");
    }

    setFollowLoading(false);
  };

  const handleUnFollow = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setFollowLoading(true);

    try {
      await unFollow({
        variables: { followId: parseInt(getFollowId[0].id) },
      });
    } catch (error) {
      alert("Something went wrong, Try again");
    }

    setFollowLoading(false);
  };

  return (
    <div className="profile">
      <div className="profile_container">
        {data.userById.profile?.avatar ? (
          <img
            src={data.userById.profile.avatar}
            alt="avatar"
            className="profile_avatar"
          />
        ) : (
          <i className="fa fa-user fa-5x" aria-hidden="true"></i>
        )}
        <div className="profile_info">
          <h3>{data.userById.name}</h3>
          <p>{data.userById.profile?.bio || "Bio"}</p>
          {data.userById.profile?.website && (
            <>
              <i className="fas fa-link" style={{ fontSize: "12px" }}>
                {" "}
              </i>
              <a href={data.userById.profile?.website}>
                {data.userById.profile?.website}
              </a>
            </>
          )}
        </div>
        {followLoading ? (
          <button className="profile_editBtn" disabled>
            Loading...
          </button>
        ) : idOfFollowers.includes(data.userById.id) ? (
          <button className="profile_editBtn" onClick={handleUnFollow}>
            Unfollow
          </button>
        ) : (
          <button className="profile_editBtn" onClick={handleFollow}>
            Follow
          </button>
        )}
      </div>

      <div className="profile_stats">
        <div className="profile_following">
          <span className="1">{data.userById.following?.length || 0}</span>
          <span className="1"> Following</span>
        </div>

        <div className="likes">
          <span className="1">{data.userById.likedTweet?.length || 0}</span>
          <span> Liked Tweets</span>
        </div>

        <div className="tweets">
          <span className="1">{data.userById.tweets?.length || 0}</span>
          <span> Tweets</span>
        </div>
      </div>
      <hr />
      <div className="usertweet_container">
        <h3 style={{ textAlign: "center" }}>User's Tweet</h3>
        {data.userById.tweets &&
          data.userById.tweets?.map((tweet: TweetType) => {
            return <TrendTweet tweet={tweet} key={tweet.id} />;
          })}
      </div>
    </div>
  );
};

export default User;
