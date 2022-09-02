import useCurrentUser from '@/hooks/useCurrentUser'
import { BasePolicy, PolicyConstructor } from '@/policies/Policy'
import { useMemo } from 'react'

const usePolicy = <T, P extends BasePolicy<T>>(policy: PolicyConstructor<P>): P => {
  const user = useCurrentUser()
  return useMemo(() => new policy(user), [policy, user])
}
export default usePolicy
