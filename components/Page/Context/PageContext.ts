import { noop } from '@/utils/fns'
import { createContext } from 'react'

export interface PageState {
  title: string
  noBackground: boolean
  update: (state: Partial<PageState>) => void
}

const PageContext = createContext<PageState>({
  title: '',
  noBackground: false,
  update: noop,
})
export default PageContext
