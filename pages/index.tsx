import UiButton from '@/components/Ui/UiButton'
import UiContainer from '@/components/Ui/UiContainer'
import useUser from '@/hooks/useUser'
import { NextPage } from 'next'
import { signIn, signOut } from 'next-auth/react'

const Home: NextPage = () => {
  const user = useUser()
  return (
    <UiContainer>
      {user === null ? (
        <UiButton onClick={() => signIn('midata')}>
          Login
        </UiButton>
      ) : (
        <UiButton onClick={() => signOut()}>
          Logout
        </UiButton>
      )}
    </UiContainer>
  )
}
export default Home
