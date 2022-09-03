import theme from '@/theme-utils'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const GroupLabelList: React.FC<Props> = ({ children }) => {
  return (
    <Box>
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
