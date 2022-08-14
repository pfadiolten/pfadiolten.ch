import { ModelData } from '@/models/base/Model'
import { createValidator, validate } from '@daniel-va/validate'

export default interface Person {
  id: string
  firstName: string
  lastName: string
  scoutName: string | null
}

export const parsePerson = (data: Person): Person => data

export const validatePerson = createValidator<ModelData<Person>>({
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
