import UiDateInput from '@/components/Ui/Input/UiDateInput'
import UiRichTextInput from '@/components/Ui/Input/UiRichTextInput'
import UiSelectInput from '@/components/Ui/Input/UiSelectInput'
import UiTextInput from '@/components/Ui/Input/UiTextInput'
import UiGrid from '@/components/Ui/UiGrid'
import UiSubmit from '@/components/Ui/UiSubmit'
import { useRequiredUser } from '@/hooks/useUser'
import { ModelData } from '@/models/base/Model'
import { emptyRichText } from '@/models/base/RichText'
import Group from '@/models/Group'
import Notice, { parseNotice, validateNotice } from '@/models/Notice'
import FetchService from '@/services/FetchService'
import { noop } from '@/utils/fns'
import DateHelper, { Weekday } from '@/utils/helpers/DateHelper'
import { Form, FormField, useCancel, useForm, useSubmit, useValidate } from '@daniel-va/react-form'
import React from 'react'

interface Props {
  notice?: Notice | null
  groups: Group[]
  onSave?: (notice: Notice) => void
  onClose?: () => void
}

const NoticeForm: React.FC<Props> = ({
  notice = null,
  groups,
  onSave: pushSave = noop,
  onClose: pushClose = noop,
}) => {
  const user = useRequiredUser()
  const form = useForm<ModelData<Notice>>(notice, () => ({
    title: '',
    description: emptyRichText(),
    groupIds: [],
    startLocation: '',
    endLocation: null,
    startsAt: NEXT_SATURDAY_START,
    endsAt: NEXT_SATURDAY_END,
    authorId: user.id,
  }))

  useValidate(form, validateNotice)

  useSubmit(form, async (data) => {
    const [newNotice, error] = await (notice === null
      ? FetchService.post<Notice>('notices', data)
      : FetchService.put<Notice>(`notices/${notice.id}`, data)
    )
    if (error !== null) {
      throw error
    }
    pushSave(parseNotice(newNotice))
    pushClose()
  })
  useCancel(form, pushClose)

  return (
    <Form state={form}>
      <FormField field={form.title}>{(inputProps) => (
        <UiTextInput {...inputProps} label="Titel" hasAutoFocus />
      )}</FormField>
      <FormField field={form.groupIds}>{(inputProps) => (
        <UiSelectInput
          {...inputProps}
          label="Stufen"
          options={groups}
          optionValue={(group) => group.id}
          optionName={(group) => group.name}
          hasMultiple
        />
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
