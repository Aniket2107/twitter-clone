import { gql, useMutation } from '@apollo/client'
import { ME_QUERY } from '../pages/Profile'

const DELETE_FOLLOW_USER_QUERY = gql`
  mutation unFollow($followId: Int) {
    unFollow(followId: $followId) {
      id
    }
  }
`

interface Props {
  id: string
}

const UnfollowUser = ({ id }: Props) => {
  const [unFollow] = useMutation(DELETE_FOLLOW_USER_QUERY, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const handleUnFollow = async () => {
    await unFollow({
      variables: { followId: parseInt(id) },
    })
  }

  return (
    <div>
      <button onClick={handleUnFollow} className="edit-button">
        Unfollow
      </button>
    </div>
  )
}

export default UnfollowUser
