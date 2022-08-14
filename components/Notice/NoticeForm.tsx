import UiDateInput from '@/components/Ui/Input/UiDateInput'
import UiTextInput from '@/components/Ui/Input/UiTextInput'
import UiGrid from '@/components/Ui/UiGrid'
import UiSubmit from '@/components/Ui/UiSubmit'
import { useRequiredUser } from '@/hooks/useUser'
import { ModelData } from '@/models/base/Model'
import Notice, { validateNotice } from '@/models/Notice'
import FetchService from '@/services/FetchService'
import { noop } from '@/utils/fns'
import DateHelper, { Weekday } from '@/utils/helpers/DateHelper'
import { Form, FormField, useCancel, useForm, useSubmit, useValidate } from '@daniel-va/react-form'
import React from 'react'

interface Props {
  onSave?: (notice: Notice) => void
  onClose?: () => void
}

const NoticeForm: React.FC<Props> = ({
  onSave: pushSave = noop,
  onClose: pushClose = noop,
}) => {
  const user = useRequiredUser()
  const form = useForm<ModelData<Notice>>(() => ({
    title: '',
    description: '',
    startsAt: NEXT_SATURDAY_START,
    endsAt: NEXT_SATURDAY_END,
    authorId: user.id,
  }))

  useValidate(form, validateNotice)

  useSubmit(form, async (data) => {
    const [notice, error] = await FetchService.post<Notice>('notices', data)
    if (error !== null) {
      throw error
    }
    pushSave(notice)
    pushClose()
  })
  useCancel(form, pushClose)

  return (
    <Form state={form}>
      <FormField field={form.title}>{(inputProps) => (
        <UiTextInput {...inputProps} label="Titel" hasAutoFocus />
      )}</FormField>
      <FormField field={form.description}>{(inputProps) => (
        <UiTextInput {...inputProps} label="Beschreibung" />
      )}</FormField>
      <UiGrid gap={1}>
        <UiGrid.Col>
          <FormField field={form.startsAt}>{(inputProps) => (
            <UiDateInput {...inputProps} label="Beginn" />
          )}</FormField>
        </UiGrid.Col>
        <UiGrid.Col>
          <FormField field={form.endsAt}>{(inputProps) => (
            <UiDateInput {...inputProps} label="Ende" />
          )}</FormField>
        </UiGrid.Col>
      </UiGrid>
      <UiSubmit />
    </Form>
  )
}
export default NoticeForm

const NEXT_SATURDAY = DateHelper.getNextWeekdayOccurrence(Weekday.SATURDAY, new Date())
const NEXT_SATURDAY_START = DateHelper.updateTime(NEXT_SATURDAY, { hours: 14, min: 0, sec: 0, ms: 0 })
const NEXT_SATURDAY_END = DateHelper.updateTime(NEXT_SATURDAY_START, { hours: 17 })
