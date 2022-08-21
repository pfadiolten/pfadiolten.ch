import theme from '@/theme-utils'
import { StyleProps } from '@/utils/props'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props extends StyleProps {
  children: ReactNode
}

const UserCardList: React.FC<Props> = ({ children, className, style }) => {
  return (
    <Box className={className} style={style}>
      {children}
    </Box>
  )
}
export default UserCardList

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
