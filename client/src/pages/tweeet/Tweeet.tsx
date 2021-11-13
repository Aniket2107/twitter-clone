import { gql, useQuery } from "@apollo/client";
import { formatDistance, subDays } from "date-fns";
import { useParams } from "react-router-dom";

import "../../components/tweet/tweet.css";
import "./tweeet.css";

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

  const { loading, error, data } = useQuery(TWEET_QUERY, {
    variables: { tweetId: parseInt(id) },
  });

  if (loading || error) {
    return <div className="lds-dual-ring">Loading...</div>;
  }

  const handleClick = () => {
    alert("Sorry you cannot like/comment from here.");
  };

  const tweet = data.tweet;

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
              <i className="far fa-heart" onClick={handleClick}></i>

              <span>{tweet.likes?.length}</span>
            </div>
            <div className="tweet_comments">
              <i className="far fa-comment" onClick={handleClick}></i>
              <span>{tweet.comments?.length}</span>
            </div>
          </div>

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
