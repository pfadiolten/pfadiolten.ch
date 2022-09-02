import { JSONContent } from '@tiptap/core'

type RichText = JSONContent
export default RichText

export const emptyRichText = (): RichText => ({
  type: 'doc',
  content: [],
})

export const isEmptyRichText = (value: RichText | null | undefined): boolean =>
  value == null
  || (
    (value.content === undefined || value.content.every(isEmptyRichText))
    && (value.text === undefined || value.text.length === 0)
  )
