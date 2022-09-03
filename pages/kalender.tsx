import CalendarEventForm from '@/components/Calendar/Event/CalendarEventForm'
import CalendarEventList from '@/components/Calendar/Event/List/CalendarEventList'
import Page from '@/components/Page/Page'
import UiButton from '@/components/Ui/Button/UiButton'
import UiToggle from '@/components/Ui/Toggle/UiToggle'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import useBool from '@/hooks/useBool'
import useCurrentUser from '@/hooks/useCurrentUser'
import LocalDate from '@/models/base/LocalDate'
import { allGroups, GroupId } from '@/models/Group'
import {
  CalendarEventFetchPayload,
  fetchCalendarEvents,
  selectCalendarEvents,
} from '@/store/calendar/events/calendarEvents.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import theme from '@/theme-utils'
import { GetServerSideProps, NextPage } from 'next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParam } from 'react-use'
import styled from 'styled-components'

interface Props {
  ssrYear: number
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  return {
    props: {
      ssrYear: parseYearParam(ctx.query.y as string | undefined, new Date().getFullYear()),
    },
  }
}

const Kalender: NextPage<Props> = ({ ssrYear }) => {
  const currentUser = useCurrentUser()

  const currentYearParam = useSearchParam('y')
  const currentYear = useMemo(() => parseYearParam(currentYearParam, ssrYear), [ssrYear, currentYearParam])

  const selectYear = useCallback((year: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('y', `${year}`)
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + params.toString()
    window.history.pushState({ path: url }, '', url)
  }, [])

  const [filters, setFilters] = useState<Filters>(() => {
    if (typeof window === 'undefined') {
      return {}
    }
    const params = new URLSearchParams(window.location.search)
    const filters: Filters = {}
    if (params.has('filter[isInternal]')) {
      filters.isInternal = true
    }
    for (const group of allGroups) {
      if (params.has(`filter[${group.id}]`)) {
        filters[group.id] = true
      }
    }
    return filters
  })
  const setFilter = (name: keyof Filters) => (value: boolean) => {
    setFilters((filters) => ({ ...filters, [name]: value }))

    const params = new URLSearchParams(window.location.search)
    const paramName = `filter[${name}]`
    if (value) {
      params.set(paramName, 'true')
    } else {
      params.delete(paramName)
    }
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + params.toString()
    window.history.pushState({ path: url }, '', url)
  }


  const fetchPayload: CalendarEventFetchPayload = useMemo(() => {
    const startsAt = LocalDate.from(currentYear, 1, 1)
    const endsAt = LocalDate.from(currentYear + 1, 1, 1) - 1
    return { startsAt, endsAt }
  }, [currentYear])

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCalendarEvents(fetchPayload))
  }, [currentYear, dispatch, fetchPayload])

  const events = useAppSelector(selectCalendarEvents(filters))
  const [isCreating, setCreating] = useBool()

  return (
    <Page title={`Jahresprogramm ${currentYear}`}>
      <Heading>
        <UiTitle level={1}>
          Jahresprogramm {currentYear}
        </UiTitle>
        <YearNav aria-label="Jahresauswahl">
          <ul>
            <li>
              <UiButton color="secondary" onClick={() => selectYear(currentYear - 1)}>
                <UiIcon name="slideLeft" />
                &nbsp;
                {currentYear - 1}
              </UiButton>
            </li>
            <li>
              {currentYear}
            </li>
            <li>
              <UiButton color="secondary" onClick={() => selectYear(currentYear + 1)}>
                {currentYear + 1}
                &nbsp;
                <UiIcon name="slideRight" />
              </UiButton>
            </li>
          </ul>
        </YearNav>
      </Heading>

      <Filters>
        <FilterLabel>
          <UiToggle value={filters.isInternal ?? false} onChange={setFilter('isInternal')} />
          Rover-Events
        </FilterLabel>
        {allGroups.map((group) => (
          <FilterLabel key={group.id}>
            <UiToggle value={filters[group.id] ?? false} onChange={setFilter(group.id)} />
            {group.shortName ?? group.name}
          </FilterLabel>
        ))}
      </Filters>

      {currentUser !== null && (
        <React.Fragment>
          <CreateEventButton color="secondary" onClick={setCreating.on} title="Neues Ereignis erstellen">
            <UiIcon name="recordAdd" />
          </CreateEventButton>
          <UiDrawer size="fixed" isOpen={isCreating} onClose={setCreating.off}>{({ close }) => (
            <React.Fragment>
              <UiTitle level={2}>
                Ereignis erstellen
              </UiTitle>
              <CalendarEventForm onClose={close} />
            </React.Fragment>
          )}</UiDrawer>
        </React.Fragment>
      )}

      <CalendarEventList events={events} />
    </Page>
  )
}
export default Kalender

type Filters =
  & { isInternal?: boolean }
  & { [K in GroupId]?: boolean }

const parseYearParam = (param: string | null | undefined, fallback: number): number => {
  const year = Number(param ?? NaN)
  if (isNaN(year)) {
    return fallback
  }
  return year
}

const Heading = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`
const YearNav = styled.nav`
  > ul {
    display: flex;
    
    > li {
      display: flex;
      align-items: center;
      
      :first-child > ${UiButton} {
        padding-right: ${theme.spacing(2)};
        margin-right: ${theme.spacing(2)};
      }
      :nth-child(2) {
        font-weight: bold;
      }
      :last-child > ${UiButton} {
        padding-left: ${theme.spacing(2)};
        margin-left: ${theme.spacing(2)};
      }
    }
  }
  
   > :nth-child(2) {
    font-weight: bold;
  }
`
const CreateEventButton = styled(UiButton)`
  border: 2px solid ${theme.color.contrast};
  width: 100%;
  padding-block: calc(${theme.spacing(1)} - 1px);
  margin-bottom: ${theme.spacing(2)};
`
const Filters = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  margin-block: ${theme.spacing(1)} ${theme.spacing(2)};
`
const FilterLabel = styled.label`
  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: ${theme.spacing(1)};
  font-size: 0.9em;
  font-weight: bold;
`
