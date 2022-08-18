import { GroupId } from '@/models/Group'
import Member, { getMemberName } from '@/models/Member'
import { ApiError } from '@/services/api/ApiErrorService'
import ApiService, { ApiResponse } from '@/services/ApiService'
import StringHelper from '@/utils/helpers/StringHelper'
import { createInMemoryCache, InMemoryCache } from '@/utils/InMemoryCache'
import { MidataPeopleResponse } from 'midata'

export type GroupMemberList = Array<{
  role: string
  members: Member[]
}>

export default ApiService.handleREST({
  async get(req, res: ApiResponse<GroupMemberList>) {
    const id = req.query.id as GroupId
    const midataGroupConfig = midataConfig[id] as MidataGroupConfig | undefined
    if (midataGroupConfig === undefined) {
      throw new ApiError(404, 'Not Found')
    }

    let cache = memberListCache[id]
    if (cache === undefined) {
      cache = createInMemoryCache(CACHE_MS)
    }
    const result = await cache.resolve(async () => {
      const roleFilter = midataGroupConfig.roles.map((role) => role.id).join('-')
      const midataResponse = await fetch(`https://db.scout.ch/de/groups/${midataGroupConfig.id}/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&filters[role][role_type_ids]=${roleFilter}&range=deep`)
      const data: MidataPeopleResponse = await midataResponse.json()

      // We only want to list the members that have certain roles (ex. Stufenleiter).
      // To filter by role, we need the id of these roles as they stored inside of MiData.
      // The next step is map each of the members returned by MiData to our own representation, the `Member` model.
      // This is not all that difficult, if MiData would return the roles of a person in a usable format, which it of course does not.
      //
      // MiData returns the roles of each member in the form of an array of ids of the member's respective roles.
      // This sounds okay and reasonable, until you notice that the ids of the roles in the response differ from the ones used to filter your query.
      // It also seems that there's no obvious way to map between the two types of ids.
      //
      // Now, the way we would then like to map between the two types of roles is to just configure both ids for each role, and use them in request and response respectively.
      // Sadly, this is also not possible, as MiData has a feature called the "label".
      // This feature allows to give a secondary name to each role assigned to a user.
      // As an example, one could give the role "Stufenleiter*in" to a specific user and give it the label "Temporärer Ersatz".
      // The label can be freely defined. In MiData's web interface, the label appears as an addition to the role's usual name,
      // with no functional differences between a role with and without a label.
      // Under the hood, however, the label seems to create an entirely new role, which shares the filter id with the original role, but HAS A DIFFERENT ID IN THE RESPONSE.
      // This means that we can't use a role's actual id to map to our roles, as we would miss all members that own that role, but are labelled for documentary purposes.
      // All in all, this behavior makes the roles' response ids almost completely useless for us.
      //
      // Luckily (haha), there's a third field besides query id and response id which identifies a role: the role's actual name.
      // This name behaves like the query id in that it is shared between labelled and unlabelled roles.
      // It is also contained in the existing MiData API response, although it is mapped to each user via the response id.
      // The obvious problem with using the role names in the mapping is that anyone ever happens to change a role's name,
      // the whole thing breaks. We are out of options, however, so we're doing it like that.
      //
      // To end this rant, here's how we're actually parsing a member's roles:
      // 1. Take the field `linked.roles` of the MiData API response.
      //    It contains an array of all roles belonging to the members contained in the response.
      // 2. Each role has an `id`, which contains the response id.
      //    It also has the field `role_type`, which is the role's name.
      //    The `MidataRoleConfig` of each of our roles also contains the `roleType`, which allows us to map from response id to our role name (called `displayName`).
      // 3. After mapping all necessary response ids to role name, we can map the members themselves.
      //    Each MiData member has a `linked.roles` field, which contains the response ids of its roles.
      //    We can now use this field to map each user to its actual role, using the mapping created in step 2.

      const midataRoleMapping = data.linked.roles?.reduce((mapping, midataRole) => {
        const roleConfig = midataGroupConfig.roles.find((roleConfig) => roleConfig.roleType === midataRole.role_type)
        if (roleConfig === undefined) {
          // The role is not used by us, so we skip it.
          return mapping
        }
        mapping[midataRole.id] = roleConfig
        return mapping
      }, {} as { [responseRoleId: string]: MidataRoleConfig }) ?? {}

      return data.people
        .map((midataMember) => {
          const role: [MidataRoleConfig, number] | null = midataMember.links.roles?.reduce((result, roleResponseId) => {
            const roleConfig = midataRoleMapping[roleResponseId]
            if (roleConfig === undefined) {
              return result
            }
            const roleIndex = midataGroupConfig.roles.findIndex((it) => it.roleType === roleConfig.roleType)
            if (roleIndex === null || (result !== null && result[1] > roleIndex)) {
              return result
            }
            return [roleConfig, roleIndex]
          }, null as [MidataRoleConfig, number] | null) ?? null
          if (role === null) {
            throw new Error(`person ${midataMember.id} does not own a known role`)
          }
          const member: Member = {
            id: StringHelper.encode64(midataMember.id),
            firstName: midataMember.first_name,
            lastName: midataMember.last_name,
            scoutName: StringHelper.nullable(midataMember.nickname),
          }
          return [role, member] as const
        })
        .sort(([roleA, a], [roleB, b]) => {
          if (roleA[1] !== roleB[1]) {
            return roleA[1] - roleB[1]
          }
          return getMemberName(a).localeCompare(getMemberName(b))
        })
        .reduce((result, [[roleConfig], member]) => {
          const members = result.find((entry) => entry.role === roleConfig.displayName)?.members
          if (members === undefined) {
            result.push({ role: roleConfig.displayName, members: [member] })
          } else {
            members.push(member)
          }
          return result
        }, [] as GroupMemberList)
    })
    return res.status(200).json(result)
  },
})

const CACHE_MS = 3_600_000 // 1h

const memberListCache: { [K in GroupId]?: InMemoryCache<GroupMemberList> } = {}

interface MidataGroupConfig {
  id: string
  roles: MidataRoleConfig[]
}

interface MidataRoleConfig {
  id: string
  roleType: string
  displayName: string
}

const makeGroupRoles = (stufenleiterId: string, leiterId: string): MidataRoleConfig[] => [
  {
    id: stufenleiterId,
    roleType: 'Einheitsleiter*in',
    displayName: 'Stufenleiter:in',
  },
  {
    id: leiterId,
    roleType: 'Mitleiter*in',
    displayName: 'Leiter:in',
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
