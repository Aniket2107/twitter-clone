import { useQuery } from '@apollo/client'
import { formatDistance, subDays } from 'date-fns'
import LeftNav from '../components/LeftNav'
import PopularTweets from '../components/PopularTweets'

import '../styles/primary.css'
import '../styles/lt.css'
import { ME_QUERY } from './Profile'
import { Link } from 'react-router-dom'

interface FdTweetType {
  id: string
  tweet: {
    id: string
    content: string
    img: string
    createdAt: string
    author: {
      name: string
      profile: {
        avatar: string
      }
    }
  }
}

const LikedTweetPg = () => {
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
          <h3 className="lt-header">Liked Tweets</h3>

          {data?.me.likedTweet?.map((tw: FdTweetType) => {
            return (
              <Link to={`/tweet/${tw.tweet.id}`} key={tw.id}>
                <div className="lt-container">
                  <div className="lt-bx1">
                    <div className="lt-bx1-1">
                      <img
                        src={tw.tweet?.author?.profile?.avatar}
                        alt="avatar"
                        className="lt-avatar"
                      />
                      <p style={{ fontSize: '20px' }}>{tw.tweet.author.name}</p>
                    </div>
                    <p>
                      {formatDistance(
                        subDays(new Date(tw.tweet.createdAt), 0),
                        new Date(),
                      )}{' '}
                      ago
                    </p>
                  </div>

                  <div>
                    <p>{tw.tweet.content}</p>
                    {tw.tweet.img && (
                      <img src={tw.tweet.img} alt="tweet" className="lt-img" />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}

          {!data.me.likedTweet.length && (
            <h3>You havn't liked any tweets yet ;(</h3>
          )}
        </div>
        <div className="right">
          <PopularTweets />
        </div>
      </div>
    </>
  )
}

export default LikedTweetPg
