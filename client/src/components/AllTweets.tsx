import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { ME_QUERY } from '../pages/Profile'

import { formatDistance } from 'date-fns'
import { subDays } from 'date-fns/esm'

import CreateComment from './CreateComment'
import DeleteLike from './DeleteLike'
import LikeTweet from './LikeTweet'

import '../styles/allTweet.css'

export const TWEETS_QUERY = gql`
  query TWEETS_QUERY {
    getTweetsByUser {
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

interface AllTweetsType {
  id: number
  content: string
  img: string
  createdAt: Date
  likes: []
  comments: []
  author: {
    id: number
    name: string
    profile: {
      avatar: string
    }
  }
}

interface LikedTweetsType {
  id: number
  tweet: {
    id: number
  }
}

const AllTweets = () => {
  const { loading, error, data } = useQuery(TWEETS_QUERY)
  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  if (meLoading) return <p>Loading...</p>
  if (meError) return <p>{meError.message}</p>

  // console.log(data.tweets)

  return (
    <div>
      {data.getTweetsByUser?.map((tweet: AllTweetsType) => (
        <div className="tweet-container" key={tweet.id}>
          <Link to={`/tweet/${tweet.id}`}>
            <div className="tweet-header">
              <img
                src={tweet.author?.profile?.avatar}
                style={{ width: '40px', borderRadius: '50%' }}
                alt="avatar"
              />
              <Link to={`/user/${tweet.author.id}`}>
                <h4 className="name">{tweet.author.name} </h4>
              </Link>
              <p className="date-time">
                {formatDistance(
                  subDays(new Date(tweet.createdAt), 0),
                  new Date(),
                )}{' '}
                ago
              </p>
            </div>
            <p className="tweet-content">{tweet.content}</p>
            {tweet.img && (
              <img src={tweet.img} alt="tweet" className="tweet-img" />
            )}
          </Link>
          <div className="likes">
            {meData.me.likedTweet
              .map((t: LikedTweetsType) => t.tweet?.id)
              .includes(tweet.id) ? (
              <span>
                <DeleteLike
                  id={
                    meData.me.likedTweet?.filter(
                      (like: LikedTweetsType) => like.tweet.id === tweet.id,
                    )[0].id
                  }
                />
                {tweet.likes?.length}
              </span>
            ) : (
              <span>
                <LikeTweet id={tweet.id} />
                {tweet.likes.length}
              </span>
            )}
            <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <CreateComment
                avatar={tweet.author.profile?.avatar}
                name={tweet.author.name}
                tweet={tweet.content}
                id={tweet.id}
              />
              {tweet.comments?.length > 0 ? tweet.comments.length : null}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllTweets
