import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import '../styles/searchUser.css'

const ALL_USERS = gql`
  query {
    allUsers {
      name
      id
      profile {
        avatar
      }
    }
  }
`

interface UserType {
  name: string
  id: string
  profile: {
    avatar: string
  }
}

const SearchUser = () => {
  const [searchQuery, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const { data } = useQuery(ALL_USERS)

  useEffect(() => {
    if (data) {
      setUsers(data.allUsers)
    }
  }, [data])

  let filteredUsers: Array<UserType> = []

  if (users && searchQuery !== '') {
    filteredUsers = users.filter((user: UserType) => {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a user.."
        value={searchQuery}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '400px',
          marginLeft: '20px',
          border: '1px solid black',
          marginTop: '10px',
        }}
      />

      {users && filteredUsers.length > 0 && (
        <div className="search">
          {filteredUsers?.map((user: UserType) => {
            return (
              <Link to={`/user/${user.id}`} key={user.id}>
                <div className="search-box">
                  {user.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt="thumbnail"
                      className="search-img"
                    />
                  ) : (
                    <i className="fas fa-user fa-3x"></i>
                  )}
                  <p className="search-name">{user.name}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchUser
