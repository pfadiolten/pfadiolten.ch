import RichText from '@/models/base/RichText'
import { GroupId } from '@/models/Group'
import SessionUser from '@/models/SessionUser'
import { createValidator, validate } from '@daniel-va/validate'
import { Id, LocalDateTime, Model, ModelData } from '@pfadiolten/react-kit'

export default interface Notice extends Model {
  title: string
  description: RichText
  groupIds: GroupId[]
  startLocation: string
  endLocation: string | null
  startsAt: LocalDateTime,
  endsAt: LocalDateTime,
  authorId: Id<SessionUser>
}

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
    (endsAt, record) => (record.startsAt ?? 0) - (endsAt ?? 0) <= 0 || 'Beginn muss vor Ende liegen',
  ],
  authorId: [],
})
