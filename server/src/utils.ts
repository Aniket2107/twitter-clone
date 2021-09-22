import { verify } from 'jsonwebtoken'
import { Context } from './context'

interface TOKEN {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, process.env.SECRET) as TOKEN

    return verifiedToken && verifiedToken.userId
  }
}
