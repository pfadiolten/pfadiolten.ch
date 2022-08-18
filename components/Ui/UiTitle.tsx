import theme from '@/theme-utils'
import { StyleProps } from '@/utils/props'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props extends StyleProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
}

const UiTitle: React.FC<Props> = ({ level, ...props }) => {
  return <Heading as={`h${level}`} {...props} />
}
export default styled(UiTitle)``

const Heading = styled.h1`
  font-family: ${theme.fonts.heading};

  h1& {
    font-weight: 300;
    font-size: 52px;
    line-height: 64px;
    letter-spacing: 0.2px;
  }

  h2& {
    font-weight: 500;
    font-size: 44px;
    line-height: 54px;
    letter-spacing: 0;
  }

  h3& {
    font-weight: 500;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0.1px;
  }

  h4& {
    font-weight: 600;
    font-size: 26px;
    line-height: 32px;
    letter-spacing: 0.2px;
  }

  h5& {
    font-weight: 500;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.2px;
  }

  h6& {
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
`
