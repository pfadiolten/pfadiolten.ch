import { JSONContent } from '@tiptap/core'

type RichText = JSONContent
export default RichText

export const emptyRichText = (): JSONContent => ({
  type: 'doc',
  content: [],
})
