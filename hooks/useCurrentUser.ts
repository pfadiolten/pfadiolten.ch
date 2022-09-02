import SessionUser from '@/models/SessionUser'
import { useSession } from 'next-auth/react'

const useCurrentUser = <TRequired extends boolean = false>({ required }: { required: TRequired } = { required: false as TRequired }): CurrentUser<TRequired> => {
  const { data } = useSession()
  const user = (data?.user ?? null) as SessionUser | null
  if (required === true && user === null) {
    throw new Error('user must be present')
  }
  return user as SessionUser
}
export default useCurrentUser

type CurrentUser<TRequired extends boolean> =
  TRequired extends true
    ? SessionUser
    : SessionUser | null
