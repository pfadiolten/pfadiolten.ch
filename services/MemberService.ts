import Member from '@/models/Member'
import { createDefaultUserData } from '@/models/UserData'
import UserDataRepo from '@/repos/UserDataRepo'
import StringHelper from '@/utils/helpers/StringHelper'
import { MidataPerson } from 'midata'

class MemberService {
  async mapFromMidata(input: MidataPerson): Promise<Member> {
    const id = StringHelper.encode64(input.id)
    return {
      id,
      name: StringHelper.nullable(input.nickname) ?? input.first_name,
      userData: await UserDataRepo.find(id) ?? createDefaultUserData(id),
    }
  }

  compare(a: Member, b: Member): number {
    return a.name.localeCompare(b.name)
  }
}
export default new MemberService()
