import User from '@/models/User'
import MiDataService from '@/services/MiDataService'
import NextAuth, { NextAuthOptions, Profile as NextAuthProfile, Session } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'midata',
      name: 'midata',
      type: 'oauth',
      wellKnown: `${process.env.PFADIOLTEN_MIDATA_URL}/.well-known/openid-configuration`,
      idToken: true,
      clientId: process.env.MIDATA_OAUTH_ID,
      clientSecret: process.env.MIDATA_OAUTH_SECRET,
      authorization: `${process.env.NEXT_PUBLIC_PFADIOLTEN_MIDATA_URL!}/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_MIDATA_OAUTH_ID!}&redirect_uri=${process.env.NEXT_PUBLIC_PFADIOLTEN_URL!}/api/auth/callback/midata&scope=email name with_roles openid api`,
      userinfo: {
        request(context) {
          return new MiDataService(context.tokens.access_token!).readUser() as unknown as Promise<NextAuthProfile>
        },
      },
      profile(profile: User) {
        return { ...profile }
      },
    },
  ],
  callbacks: {
    session({ session, token }) {
      const sessionUser: User = {
        id: token.sub!,
        email: session.user.email!,
        name: token.name!,
      }
      return {
        user: sessionUser,
        expires: session.expires,
      } as Session
    },
  },
}

export default NextAuth(authOptions)
