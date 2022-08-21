import Model from '@/models/base/Model'

export default interface Group extends Model {
  id: GroupId
  name: string
  shortName: string
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

export interface Role {
  name: string,
  groupId: GroupId
}
