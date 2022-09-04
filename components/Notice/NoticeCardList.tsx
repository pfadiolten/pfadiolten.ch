import { theme } from '@pfadiolten/react-kit'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const NoticeCardList: React.FC<Props> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  )
}
export default NoticeCardList

const Box = styled.ul`
  display: grid;
  gap: ${theme.spacing(2)};
  grid-template-columns: repeat(4, 1fr);

  ${theme.media.xs.only} {
    display: flex;
    overflow-x: auto;
    
    > * {
      flex: 0 0 60%;
      width: 0;
    }
  }
`
