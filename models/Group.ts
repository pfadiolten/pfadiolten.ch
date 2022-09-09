import Model from '@/models/base/Model'

export default interface Group<TType extends GroupType = GroupType> extends Model {
  id:
    TType extends GroupType.UNIT
      ? UnitId
      :
    TType extends GroupType.COMMITTEE
      ? CommitteeId
      :
    TType extends GroupType.ROTTE
      ? RottenId
      :
    'als'
  name: string
  shortName: string | null
  type: TType
}

export type GroupId =
  | 'als'
  | UnitId
  | RottenId
  | CommitteeId

export enum UnitId {
  BIBER = 'biber',
  WOELFLI = 'woelfli',
  PFADIS = 'pfadis',
  PIOS = 'pios',
  ROVER = 'rover',
}

export enum RottenId {
  SPASS = 'spass',
  ABC = 'abc',
}

export enum CommitteeId {
  VORSTAND = 'vorstand',
}

export enum GroupType {
  UNIT,
  ROTTE,
  COMMITTEE,
  OTHER,
}

export interface Role {
  name: string,
  groupId: GroupId
}

export const allUnits: Group<GroupType.UNIT>[] = [
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

export const allRotten: Group<GroupType.ROTTE>[] = [
  {
    id: RottenId.SPASS,
    name: 'Spassrotte',
    shortName: 'Spass',
    type: GroupType.ROTTE,
  },
  {
    id: RottenId.ABC,
    name: 'ABC-Rotte',
    shortName: 'ABC',
    type: GroupType.ROTTE,
  },
]

export const allCommittees: Group<GroupType.COMMITTEE>[] = [
  {
    id: CommitteeId.VORSTAND,
    name: 'Vorstand',
    shortName: null,
    type: GroupType.COMMITTEE,
  },
]

export const als: Group<GroupType.OTHER> = {
  id: 'als',
  name: 'Abteilungsleitung',
  shortName: 'ALs',
  type: GroupType.OTHER,
}

export const allGroups = [
  ...allUnits,
  ...allCommittees,
  als,
]
