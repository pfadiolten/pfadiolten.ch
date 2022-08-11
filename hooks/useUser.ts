import User from '@/models/User'
import { useSession } from 'next-auth/react'

const useUser = (): User | null => {
  const { data } = useSession()
  return (data?.user ?? null) as User | null
}
export default useUser
