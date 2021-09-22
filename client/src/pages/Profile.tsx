import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import CreateProfile from '../components/CreateProfile'
import Following from '../components/Following'
import LeftNav from '../components/LeftNav'
import UserTweets from '../components/UserTweets'
import PopularTweets from '../components/PopularTweets'
import UpdateProfile from '../components/UpdateProfile'

import '../styles/primary.css'
import '../styles/profile.css'

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
        }
      }
    }
  }
`

const FOLLOWERS = gql`
  query followers {
    followers
  }
`

const Profile = () => {
  // const history = useHistory()

  const { loading, error, data } = useQuery(ME_QUERY)
  const { data: fData } = useQuery(FOLLOWERS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head" style={{ marginTop: '20px' }}>
              {/* <span className="back-arrow" onClick={() => history.goBack()}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span> */}
            </div>
            <div className="avatar">
              {data.me.profile?.avatar ? (
                <img
                  src={data.me.profile.avatar}
                  style={{ width: '150px', borderRadius: '50%' }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              )}
            </div>
            <div className="make-profile">
              {data.me.profile ? <UpdateProfile /> : <CreateProfile />}
            </div>

            <h2 className="name">{data.me.name}</h2>

            <h4 className="name">{data.me.profile?.bio}</h4>

            {data.me.profile ? (
              <p>
                <i className="fas fa-link"> </i>{' '}
                <Link
                  to={{ pathname: `http://${data.me.profile.website}` }}
                  target="_blank"
                >
                  {data.me.profile.website}
                </Link>
              </p>
            ) : null}
            <div className="followers">
              <Following />
              <p>{fData?.followers || 0} Followers</p>
            </div>
          </div>
          {data.me.tweets && <UserTweets userData={data.me} />}
        </div>
        <div className="right">
          <PopularTweets />
        </div>
      </div>
    </>
  )
}

export default Profile
