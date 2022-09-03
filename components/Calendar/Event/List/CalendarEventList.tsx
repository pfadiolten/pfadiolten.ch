import CalendarEventListItem from '@/components/Calendar/Event/List/CalendarEventListItem'
import UiTitle from '@/components/Ui/UiTitle'
import LocalDate from '@/models/base/LocalDate'
import CalendarEvent from '@/models/CalendarEvent'
import theme from '@/theme-utils'
import DateHelper from '@/utils/helpers/DateHelper'
import React, { useMemo } from 'react'
import styled from 'styled-components'

interface Props {
  events: CalendarEvent[]
}

const CalendarEventList: React.FC<Props> = ({ events }) => {
  const eventsByMonth = useMemo(() => {
    const result = [] as Array<[Date, CalendarEvent[]]>
    for (const event of events) {
      const eventStart = LocalDate.toDate(event.startsAt)
      if (result.length === 0) {
        result.push([eventStart, [event]])
        continue
      }
      const [currentMonth, currentMonthEvents] = result[result.length - 1]
      if (currentMonth.getMonth() === eventStart.getMonth() && currentMonth.getFullYear() === eventStart.getFullYear()) {
        currentMonthEvents.push(event)
        continue
      }
      result.push([eventStart, [event]])
    }
    return result
  }, [events])

  return (
    <Box>
      {eventsByMonth.map(([month, monthEvents]) => (
        <MonthBox key={`${month.getFullYear()}-${month.getMonth()}`}>
          <UiTitle level={3}>
            {DateHelper.getNameOfMonth(month)} {month.getFullYear()}
          </UiTitle>
          <MonthEventList>
            {monthEvents.map((event) => (
              <CalendarEventListItem key={event.id} event={event} />
            ))}
          </MonthEventList>
        </MonthBox>
      ))}
    </Box>
  )
}
export default CalendarEventList

const Box = styled.ol`
  
`

const MonthBox = styled.li`
  :not(:first-child) {
    margin-top: ${theme.spacing(2)};
  }
`
const MonthEventList = styled.ol`
  
`
