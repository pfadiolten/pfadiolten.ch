import Id from '@/models/base/Id'
import SessionUser from '@/models/SessionUser'
import StringHelper from '@/utils/helpers/StringHelper'
import { User } from 'next-auth'

class MiDataService {
  async readUser(token: string): Promise<User> {
    const response = await fetch(`${process.env.PFADIOLTEN_MIDATA_URL!}/oauth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Scope': 'name',
      },
    })
    if (!response.ok) {
      throw new Error(`failed to read user: [${response.status}] ${response.statusText}`)
    }
    const data = await response.json()
    return {
      id: data.id,
      email: data.email,
      name: data.nickname ?? `${data.first_name} ${data.last_name}`,
    }
  }

  async checkAdmin(id: Id<SessionUser>): Promise<boolean> {
    const midataId = StringHelper.decode64(id)
    const midataResponse = await fetch(`https://db.scout.ch/de/groups/6/people/${midataId}.json?token=${process.env.MIDATA_ACCESS_TOKEN}`)
    if (midataResponse.status === 404) {
      return false
    }
    // TODO check if the user has the correct roles to be an admin. This can only be implemented on the prod MiData instance.
    const _data = await midataResponse.json()
    return false
  }
}
export default new MiDataService()

