import { ModelData } from '@/models/base/Model'
import { createValidator, validate } from '@daniel-va/validate'

export default interface Member {
  id: string
  firstName: string
  lastName: string
  scoutName: string | null
}

export const parseMember = (data: Member): Member => data

export const validateMember = createValidator<ModelData<Member>>({
  firstName: [
    validate.notBlank(),
  ],
  lastName: [
    validate.notBlank(),
  ],
  scoutName: [
    validate.notBlank({ allowNull: true }),
  ],
})

export const getMemberName = (member: Member): string => member.scoutName ?? `${member.firstName} ${member.lastName}`
