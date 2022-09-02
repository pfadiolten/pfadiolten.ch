import LocalDate from '@/models/base/LocalDate'
import Model from '@/models/base/Model'
import { GroupId } from '@/models/Group'

export default interface CalendarEvent extends Model {
  name: string
  startsAt: LocalDate
  endsAt: LocalDate
  groupIds: GroupId[]
  isInternal: boolean
}


