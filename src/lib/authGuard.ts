import { verifyToken } from './auth'

export function requireAuth(token?: string) {

  if (!token)
    throw new Error('Unauthorized')

  const decoded = verifyToken(token)

  return decoded
}
