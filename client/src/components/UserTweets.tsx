import { formatDistance, subDays } from 'date-fns'
import { Link } from 'react-router-dom'

interface AllTweets {
  id: number
  content: string
  createdAt: Date
  likes: []
  comments: []
  tweet: any
  author: {
    id: number
    name: string
    profile: {
      avatar: string
    }
  }
}

const UserTweets = ({ userData }: any) => {
  return (
    <div>
      <h2>Your tweets</h2>
      {userData?.tweets.map((tweet: AllTweets) => (
        <div className="tweet-container" key={tweet.id}>
          <div className="tweet-header">
            <img
              src={userData.profile?.avatar}
              style={{ width: '40px', borderRadius: '50%' }}
              alt="avatar"
            />

            <Link to={`/user/${userData?.id}`}>
              <h4 className="name">{userData?.name} </h4>
            </Link>
            <p className="date-time">
              {formatDistance(
                subDays(new Date(tweet.createdAt), 0),
                new Date(),
              )}{' '}
              ago
            </p>
          </div>
          <Link to={`/tweet/${tweet.id}`}>
            <p>{tweet.content}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default UserTweets
