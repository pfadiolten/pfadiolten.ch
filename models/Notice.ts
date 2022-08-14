import Id from '@/models/base/Id'
import LocalDate, { parseLocalDate } from '@/models/base/LocalDate'
import Model, { ModelData } from '@/models/base/Model'
import User from '@/models/User'
import { createValidator, validate } from '@daniel-va/validate'

export default interface Notice extends Model {
  title: string
  description: string
  startsAt: Date,
  endsAt: Date,
  authorId: Id<User>
}

export const parseNotice = (data: Notice): Notice => ({
  ...data,
  startsAt: new Date(data.startsAt),
  endsAt: new Date(data.endsAt),
})

export const validateNotice = createValidator<ModelData<Notice>>({
  title: [
    validate.notBlank(),
  ],
  description: [
    validate.notBlank(),
  ],
  startsAt: [],
  endsAt: [
    (endsAt, record) => record.startsAt.getTime() - endsAt.getTime() <= 0 || 'Anfang muss vor Ende liegen',
  ],
  authorId: [],
})
