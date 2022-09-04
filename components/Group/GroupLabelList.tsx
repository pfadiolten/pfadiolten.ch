import { theme } from '@pfadiolten/react-kit'
import { StyleProps } from '@/utils/props'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props extends StyleProps {
  children: ReactNode
}

const GroupLabelList: React.FC<Props> = ({ children, className, style }) => {
  return (
    <Box className={className} style={style}>
      {children}
    </Box>
  )
}
export default GroupLabelList

const Box = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing(1)};
`
