import Id from '@/models/base/Id'
import { ModelData } from '@/models/base/Model'
import { createDefaultUserData, UserData } from '@/models/User'
import MongoRepo from '@/repos/base/MongoRepo'
import { FindRepo, UpdateRepo } from '@/repos/Repo'
import StringHelper from '@/utils/helpers/StringHelper'
import { createKeyedInMemoryCache } from '@/utils/InMemoryCache'

class UserDataRepo implements FindRepo<UserData>, UpdateRepo<UserData> {
  async find(id: Id<UserData>): Promise<UserData | null> {
    const existingData = this.findLocally(id)
    if (existingData !== null) {
      return existingData
    }
    if (!(await this.existsInMidata(id))) {
      return null
    }
    return createDefaultUserData(id)
  }

  findLocally(id: Id<UserData>): Promise<UserData | null> {
    return BackingRepo.find(id)
  }

  async update(id: Id<UserData>, data: ModelData<UserData>): Promise<UserData | null> {
    const existingData = await BackingRepo.find(id)
    if (existingData === null && !(await this.existsInMidata(id))) {
      return null
    }
    if (existingData === null) {
      return BackingRepo.create({ ...data, id })
    } else {
      return BackingRepo.update(id, data)
    }
  }

  private async existsInMidata(id: Id<UserData>): Promise<boolean> {
    return midataPeopleCache.resolve(id, async () => {
      const midataId = StringHelper.decode64(id)
      const midataResponse = await fetch(`https://db.scout.ch/de/groups/6/people/${midataId}.json?token=${process.env.MIDATA_ACCESS_TOKEN}`)
      return midataResponse.status === 200
    })
  }
}
export default new UserDataRepo()

class MongoUserDataRepo extends MongoRepo<UserData> {
  get collection(): string {
    return 'user-data'
  }

  protected toId(id: Id<UserData>): unknown {
    return id
  }
}
const BackingRepo = new MongoUserDataRepo()

const midataPeopleCache = createKeyedInMemoryCache<Id<UserData>, boolean>(86_400_000) // 1d
