import UiDropdownContext from '@/components/Ui/Dropdown/UiDropdownContext'
import theme from '@/theme-utils'
import React, { ReactNode, useCallback, useContext, useState } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
  onClick: () => void
}

const UiDropdownItem: React.FC<Props> = ({
  children,
  onClick: pushClick,
}) => {
  const context = useContext(UiDropdownContext)
  const handleClick = useCallback(() => {
    pushClick()
    context.close()
  }, [context, pushClick])

  return (
    <Box role="menuitem" onClick={handleClick}>
      {children}
    </Box>
  )
}
export default UiDropdownItem

const Box = styled.li`
  padding: ${theme.spacing(1)};
  cursor: pointer;
  color: var(--color);
  background-color: var(--background-color);
  
  transition: ${theme.transitions.fade};
  transition-property: filter;
  
  :hover {
    filter: brightness(0.9);
  }
  :active {
    filter: brightness(0.75);
  }
`
