import Model from '@/models/base/Model'

export default interface Group<TType extends GroupType = GroupType> extends Model {
  id:
    TType extends GroupType.UNIT
      ? UnitId
      :
    TType extends GroupType.COMMITTEE
      ? CommitteeId
      :
    'als'
  name: string
  shortName: string | null
  type: TType
}

export const parseGroup = (data: Group) => data

export type GroupId =
  | 'als'
  | UnitId
  | CommitteeId

export enum UnitId {
  BIBER = 'biber',
  WOELFLI = 'woelfli',
  PFADIS = 'pfadis',
  PIOS = 'pios',
  ROVER = 'rover',
}

export enum CommitteeId {
  VORSTAND = 'vorstand',
}

export enum GroupType {
  UNIT,
  COMMITTEE,
  OTHER,
}

export interface Role {
  name: string,
  groupId: GroupId
}
