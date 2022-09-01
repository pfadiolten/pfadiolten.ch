/* eslint-disable array-bracket-spacing */
import Id from '@/models/base/Id'
import Group, { CommitteeId, GroupType, UnitId } from '@/models/Group'
import { ListOptions, ReadRepo } from '@/repos/Repo'
import { run } from '@/utils/control-flow'

class GroupRepo implements ReadRepo<Group> {
  find(id: Id<Group>): Promise<Group | null> {
    return Promise.resolve(allGroups.find((it) => it.id === id.toLowerCase()) ?? null)
  }

  list(options?: ListGroupOptions): Promise<Group[]> {
    const groups = run(() => {
      switch (options?.type) {
      case GroupType.UNIT:
        return units
      case GroupType.COMMITTEE:
        return committees
      case GroupType.OTHER:
        return [als]
      case undefined:
        return allGroups
      }
    })
    return Promise.resolve(groups.slice(0, options?.limit ?? groups.length))
  }
}
export default new GroupRepo()

export interface ListGroupOptions extends ListOptions<Group> {
  type?: GroupType
}

const units: Group<GroupType.UNIT>[] = [
  {
    id: UnitId.BIBER,
    name: 'Biberstufe',
    shortName: 'Biber',
    type: GroupType.UNIT,
  },
  {
    id: UnitId.WOELFLI,
    name: 'Wolfsstufe',
    shortName: 'Wölfe',
    type: GroupType.UNIT,
  },
  {
    id: UnitId.PFADIS,
    name: 'Pfadistufe',
    shortName: 'Pfadis',
    type: GroupType.UNIT,
  },
  {
    id: UnitId.PIOS,
    name: 'Piostufe',
    shortName: 'Pios',
    type: GroupType.UNIT,
  },
  {
    id: UnitId.ROVER,
    name: 'Roverstufe',
    shortName: 'Rover',
    type: GroupType.UNIT,
  },
]

const committees: Group<GroupType.COMMITTEE>[] = [
  {
    id: CommitteeId.VORSTAND,
    name: 'Vorstand',
    shortName: null,
    type: GroupType.COMMITTEE,
  },
]

const als: Group<GroupType.OTHER> = {
  id: 'als',
  name: 'Abteilungsleitung',
  shortName: 'ALs',
  type: GroupType.OTHER,
}

const allGroups = [
  ...units,
  ...committees,
  als,
]
