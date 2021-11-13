import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
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

type FOLLOWDATA = [FdUserType];

function Following() {
  const [followingData, setFollowingData] = useState<FOLLOWDATA | null>();
  const { loading, error, data } = useQuery(ME_QUERY);

  useEffect(() => {
    if (data) {
      setFollowingData(data.me.following);
    }

    return () => {
      setFollowingData(null);
    };
  }, [data]);

  if (loading || error || !setFollowingData) {
    return <div className="lds-dual-ring">Loading</div>;
  }

  return (
    <div className="following">
      <h3>Following</h3>

      <div className="following_container">
        {followingData?.length ? (
          followingData?.map((user: FdUserType) => {
            // console.log("user", user);
            return <FollowingList user={user} key={user.id} />;
          })
        ) : (
          <h5>You donot follow anyone ;(</h5>
        )}
      </div>
    </div>
  );
}

export default Following;
