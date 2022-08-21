import Id from '@/models/base/Id'
import Member from '@/models/Member'
import { FindRepo } from '@/repos/Repo'
import MemberService from '@/services/MemberService'
import StringHelper from '@/utils/helpers/StringHelper'
import { createKeyedInMemoryCache } from '@/utils/InMemoryCache'
import { MidataPeopleResponse } from 'midata'

class MemberRepo implements FindRepo<Member> {
  async find(id: Id<Member>): Promise<Member | null> {
    return memberCache.resolve(id, async () => {
      const midataId = StringHelper.decode64(id)
      const midataResponse = await fetch(`https://db.scout.ch/de/groups/6/people/${midataId}.json?token=${process.env.MIDATA_ACCESS_TOKEN}`)
      if (midataResponse.status === 404) {
        return null
      }
      const data: MidataPeopleResponse = await midataResponse.json()
      return await MemberService.mapFromMidata(data.people[0])
    })
  }

}
export default new MemberRepo()

const memberCache = createKeyedInMemoryCache<Id<Member>, Member | null>(3_600_000) // 1h
