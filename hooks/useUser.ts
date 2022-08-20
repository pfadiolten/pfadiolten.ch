import SessionUser from '@/models/SessionUser'
import { useSession } from 'next-auth/react'

const useUser = (): SessionUser | null => {
  const { data } = useSession()
  return (data?.user ?? null) as SessionUser | null
}
export default useUser

export const useRequiredUser = (): SessionUser => {
  const user = useUser()
  if (user === null) {
    throw new Error('user must be present')
  }
  return user
}
