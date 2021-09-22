import { gql, useQuery } from '@apollo/client'
import { Link, useHistory, useParams } from 'react-router-dom'
import LeftNav from '../components/LeftNav'
import PopularTweets from '../components/PopularTweets'
import FollowUser from '../components/FollowUser'
import UnfollowUser from '../components/UnfollowUser'

import { ME_QUERY } from './Profile'

import '../styles/primary.css'
import '../styles/profile.css'

export const USER_QUERY = gql`
  query userById($userId: Int!) {
    userById(userId: $userId) {
      id
      name
      profile {
        id
        avatar
        website
        bio
      }
    }
  }
`

interface ParamType {
  id: string
}

interface FollowerIds {
  followId: number
  id: number
}

const User = () => {
  const history = useHistory()

  const { id } = useParams<ParamType>()

  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { userId: parseInt(id) },
  })
  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  if (meLoading) return <p>Loading...</p>
  if (meError) return <p>{meError.message}</p>

  const idOfFollowers = meData.me.following?.map(
    (follow: FollowerIds) => follow.followId,
  )
  const follows = meData.me.following?.map((follow: FollowerIds) => follow)

  const getFollowId = follows.filter(
    (follow: any) => follow.followId === data.userById.id,
  )

  // console.log(data)

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head">
              <span className="back-arrow" onClick={() => history.goBack()}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span className="nickname">
                <h3 style={{ width: '150px', margin: '10px' }}>
                  {data.userById.name}
                </h3>
              </span>
            </div>
            <div className="avatar">
              {data.userById.profile?.avatar ? (
                <img
                  src={data.userById.profile?.avatar}
                  style={{ width: '150px', borderRadius: '50%' }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              )}
            </div>
            <div className="make-profile">
              {idOfFollowers.includes(data.userById.id) ? (
                <UnfollowUser id={getFollowId[0].id} />
              ) : (
                <FollowUser
                  id={data.userById.id}
                  name={data.userById.name}
                  avatar={data.userById.profile?.avatar}
                />
              )}
            </div>

            <h3 className="name">{data.userById.profile?.bio}</h3>

            {data.userById.profile ? (
              <p>
                <i className="fas fa-link"> </i>{' '}
                <Link
                  to={{ pathname: `http://${data.userById.profile.website}` }}
                  target="_blank"
                >
                  {data.userById.profile?.website}
                </Link>
              </p>
            ) : null}
            {/* <div className="followers">
              <p>200 following</p>
              <p>384 followers</p>
            </div> */}
          </div>
        </div>
        <div className="right">
          <PopularTweets />
        </div>
      </div>
    </>
  )
}

export default User
