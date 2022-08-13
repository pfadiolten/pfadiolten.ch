import React, { ReactNode, useState } from 'react'
import { useEffectOnce } from 'react-use'

interface Props {
  children: () => ReactNode
}

const UiClientOnly: React.FC<Props> = ({ children }) => {
  const [isClient, setClient] = useState(false)
  useEffectOnce(() => {
    setClient(true)
  })
  return (
    <React.Fragment>
      {isClient && children()}
    </React.Fragment>
  )
}
export default UiClientOnly
