import UserData from '@/models/UserData'

export default interface Member {
  id: string
  name: string
  userData: UserData
}

export const parseMember = (data: Member): Member => data

