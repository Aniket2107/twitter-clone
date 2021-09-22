import { gql, useMutation } from '@apollo/client'
import { ME_QUERY } from '../pages/Profile'

const FOLLOW_USER_QUERY = gql`
  mutation follow($data: Follow) {
    follow(data: $data) {
      id
    }
  }
`

interface Props {
  id: number
  name: string
  avatar: string
}

const FollowUser = ({ id, name, avatar }: Props) => {
  const [follow] = useMutation(FOLLOW_USER_QUERY, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const handleFollow = async () => {
    await follow({
      variables: {
        data: { followId: id, name, avatar },
      },
    })
  }

  return (
    <div>
      <button onClick={handleFollow} className="edit-button">
        Follow
      </button>
    </div>
  )
}

export default FollowUser
