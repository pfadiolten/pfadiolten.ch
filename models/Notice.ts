import Id from '@/models/base/Id'
import Model, { ModelData } from '@/models/base/Model'
import RichText from '@/models/base/RichText'
import { GroupId } from '@/models/Group'
import SessionUser from '@/models/SessionUser'
import { createValidator, validate } from '@daniel-va/validate'

export default interface Notice extends Model {
  title: string
  description: RichText
  groupIds: GroupId[]
  startLocation: string
  endLocation: string | null
  startsAt: Date,
  endsAt: Date,
  authorId: Id<SessionUser>
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
  description: [],
  groupIds: [],
  startLocation: [
    validate.notBlank(),
  ],
  endLocation: [
    validate.notBlank({ allowNull: true }),
  ],
  startsAt: [],
  endsAt: [
    (endsAt, record) => (record.startsAt?.getTime() ?? 0) - (endsAt?.getTime() ?? 0) <= 0 || 'Beginn muss vor Ende liegen',
  ],
  authorId: [],
})
