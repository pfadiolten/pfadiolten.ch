import UiDateInput from '@/components/Ui/Input/UiDateInput'
import UiRichTextInput from '@/components/Ui/Input/UiRichTextInput'
import UiTextInput from '@/components/Ui/Input/UiTextInput'
import UiGrid from '@/components/Ui/UiGrid'
import UiSubmit from '@/components/Ui/UiSubmit'
import { useRequiredUser } from '@/hooks/useUser'
import { ModelData } from '@/models/base/Model'
import { emptyRichText } from '@/models/base/RichText'
import Notice, { parseNotice, validateNotice } from '@/models/Notice'
import FetchService from '@/services/FetchService'
import { noop } from '@/utils/fns'
import DateHelper, { Weekday } from '@/utils/helpers/DateHelper'
import { Form, FormField, useCancel, useForm, useSubmit, useValidate } from '@daniel-va/react-form'
import React, { useRef } from 'react'
import { useUpdateEffect } from 'react-use'

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
    description: emptyRichText(),
    startLocation: '',
    endLocation: null,
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
    pushSave(parseNotice(notice))
    pushClose()
  })
  useCancel(form, pushClose)

  return (
    <Form state={form}>
      <FormField field={form.title}>{(inputProps) => (
        <UiTextInput {...inputProps} label="Titel" hasAutoFocus />
      )}</FormField>
      <FormField field={form.description}>{(inputProps) => (
        <UiRichTextInput {...inputProps} label="Beschreibung" />
      )}</FormField>
      <UiGrid gap={1}>
        <UiGrid.Col size="auto">
          <FormField field={form.startsAt}>{(inputProps) => (
            <UiDateInput {...inputProps} label="Beginn" />
          )}</FormField>
        </UiGrid.Col>
        <UiGrid.Col>
          <FormField field={form.startLocation}>{(inputProps) => (
            <UiTextInput {...inputProps} label="Treffpunkt" />
          )}</FormField>
        </UiGrid.Col>
      </UiGrid>
      <UiGrid gap={1}>
        <UiGrid.Col size="auto">
          <FormField field={form.endsAt}>{(inputProps) => (
            <UiDateInput {...inputProps} label="Ende" />
          )}</FormField>
        </UiGrid.Col>
        <UiGrid.Col>
          <FormField field={form.endLocation}>{(inputProps) => (
            <UiTextInput {...inputProps} label="Schlusspunkt" placeholder={form.startLocation.value} />
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
