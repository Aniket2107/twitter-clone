import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Redirect } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
}

export const IS_LOGGED_IN = gql`
  {
    me {
      id
    }
  }
`

const IsAuthenticated = ({ children }: Props) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN)
  // console.log(error?.graphQLErrors)
  // console.log(data?.me)

  if (loading) return <p>Loading...</p>

  if (error || !data.me) {
    return <Redirect to="/" />
  }

  return <>{children}</>
}

export default IsAuthenticated
