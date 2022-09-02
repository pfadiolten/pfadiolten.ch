import CalendarEvent from '@/models/CalendarEvent'
import MongoRepo from '@/repos/base/MongoRepo'

class CalendarEventRepo extends MongoRepo<CalendarEvent> {
  get collection(): string {
    return 'calendar-events'
  }
}
export default new CalendarEventRepo()
