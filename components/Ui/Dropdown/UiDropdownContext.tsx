import { noop } from '@/utils/fns'
import React from 'react'

export interface UiDropdownContextState {
  isOpen: boolean
  setOpen(isOpen: boolean): void
  close(): void
  open(): void
  toggle(): void
}

const UiDropdownContext = React.createContext<UiDropdownContextState>({
  isOpen: false,
  setOpen: noop,
  close: noop,
  open: noop,
  toggle: noop,
})
export default UiDropdownContext
