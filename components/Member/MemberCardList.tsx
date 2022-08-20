import theme from '@/theme-utils'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const MemberCardList: React.FC<Props> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  )
}
export default MemberCardList

const Box = styled.ul`
  display: grid;
  gap: ${theme.spacing(2)};
  grid-template-columns: repeat(1, 1fr);
  
  :not(:last-child) {
    margin-bottom: ${theme.spacing(2)};
  }
  
  ${theme.media.md.min} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${theme.media.lg.min} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${theme.media.xl.min} {
    grid-template-columns: repeat(4, 1fr);
  }
`
