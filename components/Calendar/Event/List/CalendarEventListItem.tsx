import CalendarEventForm from '@/components/Calendar/Event/CalendarEventForm'
import GroupLabel from '@/components/Group/GroupLabel'
import GroupLabelList from '@/components/Group/GroupLabelList'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiDropdown from '@/components/Ui/Dropdown/UiDropdown'
import UiDate from '@/components/Ui/UiDate'
import useBool from '@/hooks/useBool'
import useCurrentUser from '@/hooks/useCurrentUser'
import LocalDate from '@/models/base/LocalDate'
import CalendarEvent from '@/models/CalendarEvent'
import { allGroups } from '@/models/Group'
import { deleteCalendarEvent } from '@/store/calendar/events/calendarEvents.slice'
import { useAppDispatch } from '@/store/hooks'
import DateHelper from '@/utils/helpers/DateHelper'
import { KitDrawer, KitHeading, KitIcon, theme } from '@pfadiolten/react-kit'
import React, { useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  event: CalendarEvent
  isCompact?: boolean
}

const CalendarEventListItem: React.FC<Props> = ({ event, isCompact = false }) => {
  const startDate = LocalDate.toDate(event.startsAt)
  const endDate = LocalDate.toDate(event.endsAt)

  const groups = useMemo(() => allGroups.filter(({ id }) => event.groupIds.includes(id)), [event.groupIds])

  return (
    <Box isCompact={isCompact}>
      {event.name}
      <div>
        {event.startsAt === event.endsAt ? (
          <UiDate value={startDate} format={{ date: { month: 'short', year: false }}} />
        ) : (
          <React.Fragment>
            <UiDate value={startDate} format={{ date: { month: startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth() ? false : 'short', year: false }}} />
            &nbsp;-&nbsp;
            <UiDate value={endDate} format={{ date: { month: 'short', year: startDate.getFullYear() !== endDate.getFullYear() }}} />
          </React.Fragment>
        )}
      </div>
      {!isCompact && (
        <React.Fragment>
          <div>
            {DateHelper.getNameOfWeekday(startDate).slice(0, 2)}
            {event.startsAt !== event.endsAt && (
              <React.Fragment>
                -
                {DateHelper.getNameOfWeekday(endDate).slice(0, 2)}
              </React.Fragment>
            )}
          </div>
          <Actions event={event} />
        </React.Fragment>
      )}
      <GroupRow>
        <GroupLabelList>
          {event.isInternal && (
            <GroupLabel group="Rover-Event" color="info" />
          )}
          {groups.length === 0 && (
            <GroupLabel group="Alle Stufen" color="info" />
          )}
          {groups.map((group) => (
            <GroupLabel key={group.id} group={group} />
          ))}
        </GroupLabelList>
      </GroupRow>
    </Box>
  )
}
export default CalendarEventListItem

const Actions: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const dispatch = useAppDispatch()
  const [isEditing, setEditing] = useBool()
  const handleDelete = useCallback(() => {
    if (confirm(`Willst du das Ereignis "${event.name}" wirklich löschen?`)) {
      dispatch(deleteCalendarEvent(event.id))
    }
  }, [event, dispatch])

  const currentUser = useCurrentUser()
  if (currentUser === null) {
    return <div />
  }
  return (
    <React.Fragment>
      <UiDropdown>
        <UiDropdown.Activator>{({ toggle }) => (
          <UiActionButton title="Mehr" color="secondary" onClick={toggle}>
            <KitIcon.More />
          </UiActionButton>
        )}</UiDropdown.Activator>
        <UiDropdown.Menu label="Mehr zu dieser Aktivität">
          <UiDropdown.Item onClick={setEditing.on}>
            Bearbeiten
          </UiDropdown.Item>
          <UiDropdown.Item onClick={handleDelete}>
            Löschen
          </UiDropdown.Item>
        </UiDropdown.Menu>
      </UiDropdown>
      <KitDrawer size="fixed" isOpen={isEditing} onClose={setEditing.off}>{({ close }) => (
        <React.Fragment>
          <KitHeading level={2}>
            Ereignis bearbeiten
          </KitHeading>
          <CalendarEventForm event={event} onClose={close} />
        </React.Fragment>
      )}</KitDrawer>
    </React.Fragment>
  )
}

const Box = styled.li<{ isCompact: boolean }>`
  display: grid;
  grid-template-areas:
    "a b c d"
    "e e e e";
  grid-template-columns: 2fr 1fr 1fr auto;
  
  ${({ isCompact }) => isCompact && css`
    grid-template-areas:
      "a b"
      "e e";
    grid-template-columns: 2fr 1fr;
  `}
  
  padding: ${theme.spacing(1)};
  border: 1px solid ${theme.colors.secondary.contrast};
  
  :not(:first-child) {
    border-top: none;
  }
`
const GroupRow = styled.div`
  grid-area: e;
  justify-content: start;
  margin-top: ${theme.spacing(0.5)};
`
