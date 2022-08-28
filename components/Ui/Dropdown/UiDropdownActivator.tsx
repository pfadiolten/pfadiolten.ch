import UiDropdownContext, { UiDropdownContextState } from '@/components/Ui/Dropdown/UiDropdownContext'
import React, { ReactNode, useContext } from 'react'

interface Props {
  children: (context: UiDropdownContextState) => ReactNode
}

const UiDropdownActivator: React.FC<Props> = ({ children }) => {
  const context = useContext(UiDropdownContext)
  return (
    <React.Fragment>
      {children(context)}
    </React.Fragment>
  )
}
export default UiDropdownActivator
