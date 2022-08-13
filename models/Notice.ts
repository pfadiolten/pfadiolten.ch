import Id from '@/models/base/Id'
import LocalDateRange from '@/models/base/LocalDateRange'
import Model from '@/models/base/Model'
import User from '@/models/User'

export default interface Notice extends Model {
  title: string
  description: string
  duration: LocalDateRange
  authorId: Id<User>
}
