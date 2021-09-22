import { gql, useQuery } from '@apollo/client'
import { format } from 'date-fns'

import '../styles/popularTweets.css'

export const ALL_TWEETS_QUERY = gql`
  query ALL_TWEETS_QUERY {
    tweets {
      id
      createdAt
      content
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
  }
`

interface TweetType {
  id: number
  createdAt: Date
  content: string
  author: {
    profile: {
      avatar: string
    }
  }
  likes: {
    id: number
    length: number
  }
}

const PopularTweets = () => {
  const { loading, error, data } = useQuery(ALL_TWEETS_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const getPopularTweets = data.tweets
    .map((tweet: TweetType) => tweet)
    .sort(function (a: TweetType, b: TweetType) {
      return b.likes.length - a.likes.length
    })
    .slice(0, 6)

  return (
    <div className="popular-tweets" style={{ marginTop: '30px' }}>
      <h3 className="trending" style={{ marginBottom: '15px' }}>
        Trending
      </h3>
      {getPopularTweets.map((tweet: TweetType) => (
        <div className="popular-tweet-container" key={tweet.id}>
          <div className="date-title">
            <div className="title-logo">
              <img
                src={tweet.author.profile?.avatar}
                style={{ width: '40px', borderRadius: '50%' }}
                alt="avatar"
              />
              <p className="tweet-content">{tweet.content}</p>
            </div>
            <p>{format(new Date(tweet.createdAt), 'MM/dd/yy')}</p>
          </div>
          <div className="tweet-likes">
            {tweet.likes?.length > 0 ? (
              <span>Likes {tweet.likes.length}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PopularTweets
