import TwitterLogo from '../styles/assets/twitter-logo.png'
import { Link } from 'react-router-dom'

import Tweet from './Tweet'
import Logout from './Logout'

import '../styles/leftNav.css'

const LeftNav = () => {
  return (
    <div>
      <Link to="/users">
        <img src={TwitterLogo} alt="logo" style={{ width: '40px' }} />
      </Link>
      <Link to="/home">
        <h2>
          <i className="fa fa-home" aria-hidden="true" />{' '}
          <span className="title">Home</span>
        </h2>
      </Link>
      <Link to="/profile">
        <h2>
          <i className="fa fa-user" aria-hidden="true" />{' '}
          <span className="title">Profile</span>
        </h2>
      </Link>
      <Link to="/following">
        <h2>
          <i className="fas fa-user-friends" aria-hidden="true" />{' '}
          <span className="title">Following</span>
        </h2>
      </Link>
      <Link to="/liked-tweets">
        <h2>
          <i className="fas fa-thumbs-up" aria-hidden="true" />{' '}
          <span className="title">Liked Tweets</span>
        </h2>
      </Link>
      <a
        href="https://github.com/Aniket2107/twitter-clone"
        target="_blank"
        rel="noreferrer"
      >
        <h2>
          <i className="fab fa-github" aria-hidden="true" />{' '}
          <span className="title">Repo Link</span>
        </h2>
      </a>
      <Tweet />
      <Logout />
    </div>
  )
}

export default LeftNav
