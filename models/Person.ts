export default interface Person {
  id: string
  firstName: string
  lastName: string
  scoutName: string | null
}

export const parsePerson = (data: Person): Person => data
