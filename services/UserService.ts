import User, { createDefaultUserData } from '@/models/User'
import UserDataRepo from '@/repos/UserDataRepo'
import StringHelper from '@/utils/helpers/StringHelper'
import { MidataPerson } from 'midata'

class UserService {
  async mapFromMidata(input: MidataPerson): Promise<User> {
    const id = StringHelper.encode64(input.id)
    return {
      ...(await UserDataRepo.find(id) ?? createDefaultUserData(id)),
      name: StringHelper.nullable(input.nickname) ?? input.first_name,
    }
  }

  compare(a: User, b: User): number {
    return a.name.localeCompare(b.name)
  }
}
export default new UserService()
