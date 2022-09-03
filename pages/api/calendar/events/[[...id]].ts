import CalendarEventPolicy from '@/policies/CalendarEventPolicy'
import CalendarEventRepo from '@/repos/CalendarEventRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(CalendarEventRepo, {
  policy: CalendarEventPolicy,
  list(req, params) {
    const startsAt = ApiService.Params.getInt(req, 'startsAt')
    const endsAt = ApiService.Params.getInt(req, 'endsAt')
    return CalendarEventRepo.listBetween({ startsAt, endsAt, limit: params.limit })
  },
})
