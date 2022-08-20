import SessionUser from '@/models/SessionUser'
import MiDataService from '@/services/MiDataService'
import StringHelper from '@/utils/helpers/StringHelper'
import NextAuth, { User as NextAuthUser, NextAuthOptions, Profile as NextAuthProfile, Session } from 'next-auth'

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
      authorization: `${process.env.PFADIOLTEN_MIDATA_URL!}/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_MIDATA_OAUTH_ID!}&redirect_uri=${process.env.PFADIOLTEN_URL!}/api/auth/callback/midata&scope=email name with_roles openid api`,
      userinfo: {
        request(context) {
          return MiDataService.readUser(context.tokens.access_token!) as unknown as Promise<NextAuthProfile>
        },
      },
      profile(profile: SessionUser) {
        return { ...profile }
      },
    },
  ],
  callbacks: {
    async session({ session, token }): Promise<Session> {
      const id = StringHelper.encode64(token.sub!)
      const sessionUser: SessionUser = {
        id,
        email: session.user.email!,
        name: token.name!,
        // TODO enable this admin check as soon as it's implemented correctly.
        // isAdmin: await MiDataService.checkAdmin(id),
        isAdmin: true,
      }
      return {
        user: sessionUser as unknown as NextAuthUser,
        expires: session.expires,
      }
    },
  },
}

export default NextAuth(authOptions)
