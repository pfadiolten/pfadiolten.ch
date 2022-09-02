import CalendarEventPolicy from '@/policies/CalendarEventPolicy'
import CalendarEventRepo from '@/repos/CalendarEventRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(CalendarEventRepo, {
  policy: CalendarEventPolicy,
})
