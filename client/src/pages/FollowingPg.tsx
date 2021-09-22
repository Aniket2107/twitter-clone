import { useQuery } from '@apollo/client'
import LeftNav from '../components/LeftNav'
import PopularTweets from '../components/PopularTweets'

import '../styles/primary.css'
import '../styles/followingPg.css'
import { ME_QUERY } from './Profile'
import { Link } from 'react-router-dom'

interface FdUserType {
  name: string
  avatar: string
  id: string
  followId: string
}

const FollowingPg = () => {
  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>

        <div>
          <h3 className="follow-head">Following</h3>

          <div className="follow-container">
            {data?.me.following?.map((user: FdUserType) => {
              return (
                <div className="follow-box" key={user.id}>
                  <Link to={`/user/${user.followId}`}>
                    <div className="follow-bx1">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="thumbnail"
                          className="follow-img"
                        />
                      ) : (
                        <i className="fas fa-user fa-3x"></i>
                      )}
                      <h2>{user.name}</h2>
                    </div>
                  </Link>

                  <button className="follow-btn">Following</button>
                </div>
              )
            })}

            {!data.me.following.length && <h3>You donot follow anyone</h3>}
          </div>
        </div>

        <div className="right">
          <PopularTweets />
        </div>
      </div>
    </>
  )
}

export default FollowingPg
