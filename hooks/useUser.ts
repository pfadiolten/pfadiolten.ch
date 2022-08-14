import User from '@/models/User'
import { useSession } from 'next-auth/react'

const useUser = (): User | null => {
  const { data } = useSession()
  return (data?.user ?? null) as User | null
}
export default useUser

export const useRequiredUser = (): User => {
  const user = useUser()
  if (user === null) {
    throw new Error('user must be present')
  }
  return user
}
