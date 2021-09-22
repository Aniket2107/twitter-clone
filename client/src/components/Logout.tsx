import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router'
import { ME_QUERY } from '../pages/Profile'

import '../styles/logout.css'

const Logout = () => {
  const history = useHistory()

  const { loading, error } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const handleLogout = async () => {
    localStorage.removeItem('twitter-token')
    history.push('/login')
  }

  return (
    <div className="logout">
      <button className="logout-btn" onClick={handleLogout}>
        <span>Logout</span>{' '}
      </button>
    </div>
  )
}

export default Logout
