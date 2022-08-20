import Member, { getMemberName } from '@/models/Member'
import { createDefaultUserData } from '@/models/UserData'
import UserDataRepo from '@/repos/UserDataRepo'
import StringHelper from '@/utils/helpers/StringHelper'
import { MidataPerson } from 'midata'

class MemberService {
  async mapFromMidata(input: MidataPerson): Promise<Member> {
    const id = StringHelper.encode64(input.id)
    return {
      id,
      firstName: input.first_name,
      lastName: input.last_name,
      scoutName: StringHelper.nullable(input.nickname),
      userData: await UserDataRepo.find(id) ?? createDefaultUserData(id),
    }
  }

  compare(a: Member, b: Member): number {
    return getMemberName(a).localeCompare(getMemberName(b))
  }
}
export default new MemberService()
