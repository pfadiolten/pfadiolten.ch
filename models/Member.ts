import UserData from '@/models/UserData'

export default interface Member {
  id: string
  firstName: string
  lastName: string
  scoutName: string | null
  userData: UserData
}

export const parseMember = (data: Member): Member => data

export const getMemberName = (member: Member): string => member.scoutName ?? `${member.firstName} ${member.lastName}`
