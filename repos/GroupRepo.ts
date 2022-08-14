import Id from '@/models/base/Id'
import Group, { GroupId } from '@/models/Group'
import { ListOptions, ReadRepo } from '@/repos/Repo'
import { defaultTheme } from '@/theme'

class GroupRepo implements ReadRepo<Group> {
  find(id: Id<Group>): Promise<Group | null> {
    return Promise.resolve(groups.find((it) => it.id === id.toLowerCase()) ?? null)
  }

  list(options?: ListOptions<Group>): Promise<Group[]> {
    return Promise.resolve(groups.slice(0, options?.limit ?? groups.length))
  }
}
export default new GroupRepo()

const groups: Group[] = [
  {
    id: 'biber',
    name: 'Biberstufe',
    shortName: 'Biber',
    color: defaultTheme.colors.primary,
  },
  {
    id: 'woelfli',
    name: 'Wolfsstufe',
    shortName: 'Wölfe',
    color: defaultTheme.colors.primary,
  },
  {
    id: 'pfadis',
    name: 'Pfadistufe',
    shortName: 'Pfadis',
    color: defaultTheme.colors.primary,
  },
  {
    id: 'pios',
    name: 'Piostufe',
    shortName: 'Pios',
    color: defaultTheme.colors.primary,
  },
  {
    id: 'rover',
    name: 'Roverstufe',
    shortName: 'Rover',
    color: defaultTheme.colors.primary,
  },
]

const midataGroupIds: { [x in GroupId]: string } = {
  biber: '5045',
  woelfli: '2467',
  pfadis: '2468',
  pios: '2469',
  rover: '2470',
}
