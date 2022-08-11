import { ISODateString, User } from 'next-auth'

declare module "next-auth" {
  export interface Session {
    user: User
    expires: ISODateString
  }
}
