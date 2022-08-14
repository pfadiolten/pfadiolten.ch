import Model from '@/models/base/Model'
import { Color } from '@/theme'

export default interface Group extends Model {
  id: GroupId
  name: string
  shortName: string
  color: Color
}

export const parseGroup = (data: Group) => data

export type GroupId =
  | 'biber'
  | 'woelfli'
  | 'pfadis'
  | 'pios'
  | 'rover'
