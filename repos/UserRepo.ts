import { Id } from '@pfadiolten/react-kit'
import { GroupId, Role } from '@/models/Group'
import User, { createDefaultUserData } from '@/models/User'
import { ListOptions, ReadRepo } from '@/repos/Repo'
import UserDataRepo from '@/repos/UserDataRepo'
import { isNotNull } from '@/utils/control-flow'
import StringHelper from '@/utils/helpers/StringHelper'
import { createInMemoryCache, createKeyedInMemoryCache } from '@/utils/InMemoryCache'
import { MidataPeopleResponse, MidataPerson } from 'midata'

class UserRepo implements ReadRepo<User> {
  async list(options?: ListOptions<User>): Promise<User[]> {
    const users = await userListCache.resolve(async () => {
      const roleFilter = Object.values(midataGroupConfigs).reduce((filter, groupConfig) => {
        if (filter.length !== 0) {
          filter += '-'
        }
        filter += groupConfig.roles.map((role) => role.id).join('-')
        return filter
      }, '')
      const users = await fetchUsersFromMidata(`https://db.scout.ch/de/groups/6/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&filters[role][role_type_ids]=${roleFilter}&range=deep`)
      if (users === null) {
        throw new Error('failed to list users: group 6 (Pfadi Olten) could not be found')
      }
      users.sort(compareUsers)

      // Update other caches
      const usersByGroup = new Map<GroupId, User[]>()
      for (const user of users) {
        userCache.insert(user.id, user)
        const userGroupIds = new Set(user.roles.map((role) => role.groupId))
        for (const groupId of userGroupIds) {
          const groupUsers = usersByGroup.get(groupId)
          if (groupUsers === undefined) {
            usersByGroup.set(groupId, [user])
          } else {
            groupUsers.push(user)
          }
        }
      }
      for (const [groupId, groupUsers] of usersByGroup) {
        groupUsers.sort(compareGroupUsers(groupId))
        groupUserListCache.insert(groupId, groupUsers)
      }
      return users
    })

    if (options?.limit != null && options.limit > 0) {
      return users.slice(0, options.limit)
    }
    return users
  }

  async listGroup(groupId: GroupId): Promise<User[] | null> {
    return groupUserListCache.resolve(groupId, async () => {
      const groupConfig = midataGroupConfigs[groupId]
      if (groupConfig.roles.length === 0) {
        return []
      }
      const roleFilter = groupConfig.roles.map((role) => role.id).join('-')
      const users = await fetchUsersFromMidata(`https://db.scout.ch/de/groups/${groupConfig.id}/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&filters[role][role_type_ids]=${roleFilter}&range=deep`)
      if (users === null) {
        return null
      }
      users.sort(compareGroupUsers(groupId))
      for (const user of users) {
        userCache.insert(user.id, user)
      }
      return users
    })
  }

  async find(id: Id<User>): Promise<User | null> {
    return userCache.resolve(id, async () => {
      const midataId = StringHelper.decode64(id)
      const midataResponse = await fetch(`https://db.scout.ch/de/groups/6/people/${midataId}.json?token=${process.env.MIDATA_ACCESS_TOKEN}`)
      if (midataResponse.status === 404) {
        return null
      }
      const data: MidataPeopleResponse = await midataResponse.json()
      return mapUserFromMidata(data.people[0], data)
    })
  }
}
export default new UserRepo()

const userListCache = createInMemoryCache<User[]>(3_600_000) // 1h
const groupUserListCache = createKeyedInMemoryCache<GroupId, User[] | null>(3_600_000) // 1h
const userCache = createKeyedInMemoryCache<Id<User>, User | null>(3_600_000) // 1h


interface MidataGroupConfig {
  id: string
  roles: MidataRoleConfig[]
}

interface MidataRoleConfig {
  id: string
  roleType: string
  roleLabel?: string
  roleName: string
}

const makeGroupRoles = (stufenleiterId: string, leiterId: string): MidataRoleConfig[] => [
  {
    id: stufenleiterId,
    roleType: 'Einheitsleiter*in',
    roleName: 'Stufenleitung',
  },
  {
    id: leiterId,
    roleType: 'Mitleiter*in',
    roleName: 'Leiter:in',
  },
]

const midataGroupConfigs: { [x in GroupId]: MidataGroupConfig } = {
  als: {
    id: '5993',
    roles: [
      {
        id: '7',
        roleType: 'Leiter*in',
        roleName: 'Abteilungsleitung',
      },
    ],
  },
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
  spass: {
    id: '8777',
    roles: [
      {
        id: '7',
        roleType: 'Leiter*in',
        roleName: 'Mitglied',
      },
    ],
  },
  abc: {
    id: '8776',
    roles: [
      {
        id: '7',
        roleType: 'Leiter*in',
        roleName: 'Mitglied',
      },
    ],
  },
  vorstand: {
    id: '5395',
    roles: [
      {
        id: '39',
        roleType: 'Präsident*in',
        roleName: 'Vereinspräsident:in',
      },
      {
        id: '40',
        roleType: 'Mitglied',
        roleLabel: 'Abteilungsleitung',
        roleName: 'Abteilungsleitung',
      },
      {
        id: '40',
        roleType: 'Mitglied',
        roleName: 'Mitglied',
      },
    ],
  },
}

const fetchUsersFromMidata = async (url: string): Promise<User[] | null> => {
  const midataResponse = await fetch(url)
  if (midataResponse.status === 404) {
    return null
  }
  const data: MidataPeopleResponse = await midataResponse.json()
  return await Promise.all(data.people.map((person) => mapUserFromMidata(person, data)))
}

export const mapUserFromMidata = async (midataPerson: MidataPerson, midataResponse: MidataPeopleResponse): Promise<User> => {
  const roles: Role[] = (midataPerson.links.roles ?? [])
    .map((midataRoleId) => {
      const midataRole = midataResponse.linked.roles?.find((midataRole) => midataRole.id === midataRoleId) ?? null
      if (midataRole === null) {
        return null
      }
      for (const groupId of Object.keys(midataGroupConfigs)) {
        const groupConfig = midataGroupConfigs[groupId]
        if (midataRole.links.group !== groupConfig.id) {
          continue
        }
        for (const roleConfig of groupConfig.roles) {
          if (roleConfig.roleType === midataRole.role_type && (roleConfig.roleLabel === undefined || roleConfig.roleLabel === midataRole.label)) {
            const role: Role = {
              groupId,
              name: roleConfig.roleName,
            }
            return role
          }
        }
      }
      return null
    })
    .filter(isNotNull)
  const id = StringHelper.encode64(midataPerson.id)
  return {
    ...(await UserDataRepo.findLocally(id) ?? createDefaultUserData(id)),
    name: StringHelper.nullable(midataPerson.nickname) ?? midataPerson.first_name,
    roles,
  }
}

export const compareUsers = (a: User, b: User): number => (
  a.name.localeCompare(b.name)
)
const compareGroupUsers = (groupId: GroupId) => {
  const findHighestRoleIndex = (roles: Role[]): number => roles.reduce((maxIndex, role) => {
    if (role.groupId !== groupId) {
      return maxIndex
    }
    const roleIndex = midataGroupConfigs[groupId].roles.findIndex((roleConfig) => roleConfig.roleName === role.name)
    return Math.max(maxIndex, roleIndex)
  }, -1)

  return (a: User, b: User): number => {
    const roleA = findHighestRoleIndex(a.roles)
    const roleB = findHighestRoleIndex(b.roles)

    const diff = roleA - roleB
    if (diff !== 0) {
      return diff
    }
    return compareUsers(a, b)
  }
}
