import { GroupId } from '@/models/Group'
import { createValidator, validate } from '@daniel-va/validate'
import { LocalDate, Model, ModelData } from '@pfadiolten/react-kit'

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
    (endsAt, record) => record.startsAt <= record.endsAt || 'Beginn muss vor Ende liegen',
  ],
  groupIds: [],
  isInternal: [],
})
