import Id from '@/models/base/Id'
import { GroupId, Role } from '@/models/Group'
import User from '@/models/User'
import { ListOptions, ReadRepo } from '@/repos/Repo'
import UserService from '@/services/UserService'
import StringHelper from '@/utils/helpers/StringHelper'
import { createKeyedInMemoryCache } from '@/utils/InMemoryCache'
import { MidataPeopleResponse } from 'midata'

class UserRepo implements ReadRepo<User> {
  async list(options?: ListOptions<User>): Promise<User[]> {
    const roleFilter = Object.values(midataConfig).reduce((filter, groupConfig) => {
      if (filter.length !== 0) {
        filter += '-'
      }
      filter += groupConfig.roles.map((role) => role.id).join('-')
      return filter
    }, '')

    const midataResponse = await fetch(`https://db.scout.ch/de/groups/6/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&filters[role][role_type_ids]=${roleFilter}&range=deep`)
    const data: MidataPeopleResponse = await midataResponse.json()
    // return data

    throw new Error('nyi')
  }

  async find(id: Id<User>): Promise<User | null> {
    return userCache.resolve(id, async () => {
      const midataId = StringHelper.decode64(id)
      const midataResponse = await fetch(`https://db.scout.ch/de/groups/6/people/${midataId}.json?token=${process.env.MIDATA_ACCESS_TOKEN}`)
      if (midataResponse.status === 404) {
        return null
      }
      const data: MidataPeopleResponse = await midataResponse.json()
      return await UserService.mapFromMidata(data.people[0])
    })
  }
}
export default new UserRepo()

const userCache = createKeyedInMemoryCache<Id<User>, User | null>(3_600_000) // 1h

interface MidataGroupConfig {
  id: string
  roles: MidataRoleConfig[]
}

interface MidataRoleConfig {
  id: string
  roleType: string
  role: Role
}

const makeGroupRoles = (stufenleiterId: string, leiterId: string): MidataRoleConfig[] => [
  {
    id: stufenleiterId,
    roleType: 'Einheitsleiter*in',
    role: {
      name: 'Stufenleitung',
    },
  },
  {
    id: leiterId,
    roleType: 'Mitleiter*in',
    role: {
      name: 'Leiter:in',
    },
  },
]

const midataConfig: { [x in GroupId]: MidataGroupConfig } = {
  biber: {
    id: '5045',
    roles: makeGroupRoles('9', '10'),
  },
  woelfli: {
    id: '2467',
    roles: makeGroupRoles('13', '14'),
  },
  pfadis: {
    id: '2468',
    roles: makeGroupRoles('18', '19'),
  },
  pios: {
    id: '2469',
    roles: makeGroupRoles('23', '24'),
  },
  rover: {
    id: '2470',
    roles: [],
  },
}
