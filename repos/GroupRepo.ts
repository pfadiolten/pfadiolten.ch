/* eslint-disable array-bracket-spacing */
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
    color: {
      value:    [255, 193,   7],
      contrast: [ 56,  54,  89],
    },
  },
  {
    id: 'woelfli',
    name: 'Wolfsstufe',
    shortName: 'Wölfe',
    color: {
      value:    [  0, 130, 165],
      contrast: [220, 215, 209],
    },
  },
  {
    id: 'pfadis',
    name: 'Pfadistufe',
    shortName: 'Pfadis',
    color: {
      value:    [115,  98,  91],
      contrast: [220, 215, 209],
    },
  },
  {
    id: 'pios',
    name: 'Piostufe',
    shortName: 'Pios',
    color: {
      value:    [215,  46,  23],
      contrast: [220, 215, 209],
    },
  },
  {
    id: 'rover',
    name: 'Roverstufe',
    shortName: 'Rover',
    color: {
      value:    [ 10,  93,  65],
      contrast: [220, 215, 209],
    },
  },
]

const midataGroupIds: { [x in GroupId]: string } = {
  biber: '5045',
  woelfli: '2467',
  pfadis: '2468',
  pios: '2469',
  rover: '2470',
}
