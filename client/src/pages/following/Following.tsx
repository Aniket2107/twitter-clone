import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import ALoader from "../../components/Loader";
import { ME_QUERY } from "../profile/Profile";

import "./following.css";

interface FdUserType {
  name: string;
  avatar: string;
  id: string;
  followId: string;
}

interface IProps {
  user: FdUserType;
}

const FollowingList: React.FC<IProps> = ({ user }) => {
  return (
    <div className="following_list">
      <div>
        {user.avatar ? (
          <img src={user.avatar} alt="avatar" className="following_avatar" />
        ) : (
          <i className="fa fa-user following_avatar" aria-hidden="true"></i>
        )}

        <h4>{user.name}</h4>
      </div>

      <p className="following_follow">Following</p>
    </div>
  );
};

function Following() {
  const { loading, error, data } = useQuery(ME_QUERY);

  if (loading || error) {
    return (
      <div className="alignHomeLoader">
        <ALoader />
      </div>
    );
  }

  return (
    <div className="following">
      <h3>Following</h3>

      <div className="following_container">
        {data.me.following?.length ? (
          data.me.following?.map((user: FdUserType) => {
            return (
              <Link
                to={`/user/${user.followId}`}
                className="td-n c-000"
                key={user.id}
              >
                <FollowingList user={user} />
              </Link>
            );
          })
        ) : (
          <h5>You donot follow anyone ;(</h5>
        )}
      </div>
    </div>
  );
}

export default Following;
