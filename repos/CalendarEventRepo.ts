import CalendarEvent from '@/models/CalendarEvent'
import MongoRepo, { Doc } from '@/repos/base/MongoRepo'
import { ListOptions } from '@/repos/Repo'
import { LocalDate } from '@pfadiolten/react-kit'
import { Filter } from 'mongodb'

class CalendarEventRepo extends MongoRepo<CalendarEvent> {
  get collection(): string {
    return 'calendar-events'
  }

  async listBetween(options: ListBetweenOptions = {}) {
    const {
      limit,
      startsAt = null,
      endsAt = null,
    } = options

    const orFilters: Array<Filter<Doc<CalendarEvent>>> = []
    if (startsAt !== null) {
      const filter: Filter<Doc<CalendarEvent>> = { startsAt: {
        $gte: startsAt,
        $lte: endsAt === null ? undefined : endsAt,
      }}
      orFilters.push(filter)
    }
    if (endsAt !== null) {
      const filter: Filter<Doc<CalendarEvent>> = { endsAt: {
        $lte: endsAt,
        $gte: startsAt === null ? undefined : startsAt,
      }}
      orFilters.push(filter)
    }
    return this.listWhere({ $or: orFilters }, {
      limit: limit ?? undefined,
    })
  }
}
export default new CalendarEventRepo()

interface ListBetweenOptions extends ListOptions<CalendarEvent> {
  startsAt?: LocalDate | null
  endsAt?: LocalDate | null
}
