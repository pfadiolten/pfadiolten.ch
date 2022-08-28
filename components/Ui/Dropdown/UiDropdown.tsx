import UiDropdownActivator from '@/components/Ui/Dropdown/UiDropdownActivator'
import UiDropdownContext, { UiDropdownContextState } from '@/components/Ui/Dropdown/UiDropdownContext'
import UiDropdownItem from '@/components/Ui/Dropdown/UiDropdownItem'
import UiDropdownMenu from '@/components/Ui/Dropdown/UiDropdownMenu'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { useClickAway } from 'react-use'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const UiDropdown: React.FC<Props> = ({ children }) => {
  const [isOpen, setOpen] = useState(false)
  const context: UiDropdownContextState = useMemo(() => ({
    isOpen,
    setOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen),
  }), [isOpen])

  const elementRef = useRef<HTMLDivElement | null>(null)
  useClickAway(elementRef, () => {
    setOpen(false)
  })

  return (
    <UiDropdownContext.Provider value={context}>
      <Box ref={elementRef}>
        {children}
      </Box>
    </UiDropdownContext.Provider>
  )
}
export default Object.assign(UiDropdown, {
  Activator: UiDropdownActivator,
  Menu: UiDropdownMenu,
  Item: UiDropdownItem,
})

const Box = styled.div`
  position: relative;
`
