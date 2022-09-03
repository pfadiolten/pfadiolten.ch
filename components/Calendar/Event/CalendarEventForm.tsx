import UiLocalDateInput from '@/components/Ui/Input/UiLocalDateInput'
import UiSelectInput from '@/components/Ui/Input/UiSelectInput'
import UiTextInput from '@/components/Ui/Input/UiTextInput'
import UiToggle from '@/components/Ui/Toggle/UiToggle'
import UiGrid from '@/components/Ui/UiGrid'
import UiSubmit from '@/components/Ui/UiSubmit'
import LocalDate from '@/models/base/LocalDate'
import { ModelData } from '@/models/base/Model'
import CalendarEvent, { validateCalendarEvent } from '@/models/CalendarEvent'
import { allGroups } from '@/models/Group'
import { createCalendarEvent, updateCalendarEvent } from '@/store/calendar/events/calendarEvents.slice'
import { useAppDispatch } from '@/store/hooks'
import theme from '@/theme-utils'
import { Form, FormField, useCancel, useForm, useSubmit, useValidate } from '@daniel-va/react-form'
import React from 'react'
import { useUpdateEffect } from 'react-use'
import styled from 'styled-components'

interface Props {
  event?: CalendarEvent | null
  onClose: () => void
}

const CalendarEventForm: React.FC<Props> = ({ event = null, onClose: pushClose }) => {
  const form = useForm<ModelData<CalendarEvent>>(event, () => ({
    name: '',
    startsAt: LocalDate.fromDate(new Date()),
    endsAt: LocalDate.fromDate(new Date()),
    groupIds: [],
    isInternal: false,
  }))
  useValidate(form, validateCalendarEvent)

  const dispatch = useAppDispatch()
  useSubmit(form, async (data) => {
    await (event === null
      ? dispatch(createCalendarEvent(data))
      : dispatch(updateCalendarEvent({ id: event.id, data }))
    )
    pushClose()
  })
  useCancel(form, pushClose)

  useUpdateEffect(function adaptEndsAtToStartsAt() {
    if (form.startsAt.value > form.endsAt.value) {
      form.endsAt.setValue(form.startsAt.value)
    }
  }, [form.startsAt.value])

  useUpdateEffect(function adaptStartsAtToEndsAt() {
    if (form.endsAt.value < form.startsAt.value) {
      form.startsAt.setValue(form.endsAt.value)
    }
  }, [form.endsAt.value])

  return (
    <Form state={form}>
      <FormField field={form.name}>{(inputProps) => (
        <UiTextInput {...inputProps} label="Name" hasAutoFocus />
      )}</FormField>
      <UiGrid gap={1}>
        <UiGrid.Col>
          <FormField field={form.groupIds}>{(inputProps) => (
            <UiSelectInput
              {...inputProps}
              label="Stufen"
              options={allGroups}
              optionValue={({ id }) => id}
              optionName={({ name }) => name}
              hasMultiple
            />
          )}</FormField>
        </UiGrid.Col>
        <UiGrid.Col size="auto">
          <FormField field={form.isInternal}>{({ value, onChange }) => (
            <InternalLabel>
              <div>
                Rover-Event?
              </div>
              <UiToggle value={value ?? false} onChange={onChange} />
            </InternalLabel>
          )}</FormField>
        </UiGrid.Col>
      </UiGrid>
      <UiGrid gap={1}>
        <UiGrid.Col>
          <FormField field={form.startsAt}>{(inputProps) => (
            <UiLocalDateInput {...inputProps} label="Beginn" />
          )}</FormField>
        </UiGrid.Col>
        <UiGrid.Col>
          <FormField field={form.endsAt}>{(inputProps) => (
            <UiLocalDateInput {...inputProps} label="Ende" />
          )}</FormField>
        </UiGrid.Col>
      </UiGrid>
      <UiSubmit />
    </Form>
  )
}
export default CalendarEventForm

const InternalLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
  height: calc(100% - 1rem);
  font-size: 0.9em;
  font-weight: bold;
`
