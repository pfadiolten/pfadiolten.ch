import CalendarEvent from '@/models/CalendarEvent'
import { BasePolicy, InferPolicy } from '@/policies/Policy'
import CalendarEventRepo from '@/repos/CalendarEventRepo'

export default class CalendarEventPolicy extends BasePolicy<CalendarEvent> implements InferPolicy<typeof CalendarEventRepo> {
  canList(): boolean {
    return true
  }

  canRead(_record: CalendarEvent): boolean {
    return true
  }

  canCreate(): boolean {
    return this.hasUser
  }

  canEdit(_record: CalendarEvent): boolean {
    return this.hasUser
  }

  canDelete(_record: CalendarEvent): boolean {
    return this.hasUser
  }
}
