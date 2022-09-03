import LocalDate from '@/models/base/LocalDate'
import Model, { ModelData } from '@/models/base/Model'
import { GroupId } from '@/models/Group'
import { createValidator, validate } from '@daniel-va/validate'

export default interface CalendarEvent extends Model {
  name: string
  startsAt: LocalDate
  endsAt: LocalDate
  groupIds: GroupId[]
  isInternal: boolean
}

export const validateCalendarEvent = createValidator<ModelData<CalendarEvent>>({
  name: [
    validate.notBlank(),
  ],
  startsAt: [],
  endsAt: [
    (endsAt, record) => (record.startsAt?.days ?? 0) - (endsAt?.days ?? 0) <= 0 || 'Beginn muss vor Ende liegen',
  ],
  groupIds: [],
  isInternal: [],
})
