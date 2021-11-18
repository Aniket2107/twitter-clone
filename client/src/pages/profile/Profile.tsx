import { gql, useQuery } from "@apollo/client";
import ALoader from "../../components/Loader";
import CreateProfile from "../../components/profile/CreateProfile";
import UpdateProfile from "../../components/profile/UpdateProfile";
import TrendTweet, { TweetType } from "../../components/trendtweet/TrendTweet";

import "./profile.css";

export const ME_QUERY = gql`
  query me {
    me {
      id
      name
      profile {
        id
        bio
        location
        website
        avatar
      }
      following {
        id
        followId
        name
        avatar
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
          id
          name
          profile {
            id
            avatar
          }
        }
      }
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

const FOLLOWERS = gql`
  query followers {
    followers
  }
`;

function Profile() {
  // const [data,setData] = useState();
  // const [fData,setFData] = useState();

  const { loading, error, data } = useQuery(ME_QUERY);
  const { data: fData } = useQuery(FOLLOWERS);

  if (loading || error) {
    return (
      <div className="alignHomeLoader">
        <ALoader />
      </div>
    );
  }

  if (data.me.profile?.avatar) {
    localStorage.setItem(
      "twitter-user",
      JSON.stringify({
        name: data.me.name,
        profile: {
          avatar: data.me.profile.avatar,
        },
      })
    );
  }

  return (
    <div className="profile">
      <div className="profile_container">
        {data.me.profile?.avatar ? (
          <img
            src={data.me.profile.avatar}
            alt="avatar"
            className="profile_avatar"
          />
        ) : (
          <i className="fa fa-user fa-5x" aria-hidden="true"></i>
        )}

        <div className="profile_info">
          <h3>{data.me.name}</h3>
          <p>{data.me.profile?.bio || "Bio"}</p>
          {data.me.profile?.location && (
            <>
              <i
                className="fa fa-map-marker"
                aria-hidden="true"
                style={{ color: "#333" }}
              ></i>
              <p style={{ display: "inline" }}>{data.me.profile?.location}</p>
            </>
          )}
          {data.me.profile?.website && (
            <>
              <br />
              <br />
              <i className="fas fa-link" style={{ fontSize: "12px" }}></i>
              <a href={data.me.profile?.website}>{data.me.profile?.website}</a>
            </>
          )}
        </div>

        {data.me.profile ? <UpdateProfile /> : <CreateProfile />}
      </div>

      <div className="profile_stats">
        <div className="followers">
          <span className="1">{fData?.followers || 0}</span>
          <span> Followers</span>
        </div>

        <div className="profile_following">
          <span className="1">{data.me.following?.length || 0}</span>
          <span className="1"> Following</span>
        </div>

        <div className="likes">
          <span className="1">{data.me.likedTweet?.length || 0}</span>
          <span> Liked Tweets</span>
        </div>

        <div className="tweets">
          <span className="1">{data.me.tweets?.length || 0}</span>
          <span> Tweets</span>
        </div>
      </div>
      <hr />
      <div className="usertweet_container">
        <h3 style={{ textAlign: "center" }}>User's Tweet</h3>
        {data.me.tweets &&
          data.me.tweets?.map((tweet: TweetType) => {
            return <TrendTweet tweet={tweet} key={tweet.id} update={true} />;
          })}
      </div>
    </div>
  );
}

export default Profile;
