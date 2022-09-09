import UiDropdownContext from '@/components/Ui/Dropdown/UiDropdownContext'
import { UiDropdownItemBox } from '@/components/Ui/Dropdown/UiDropdownItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useContext } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  href: string
  children: ReactNode
}

const UiDropdownLink: React.FC<Props> = ({
  href,
  children,
}) => {
  const context = useContext(UiDropdownContext)
  const path = useRouter().asPath.toLowerCase()
  const isActive = path.startsWith(href.toLowerCase())

  return (
    <Box isActive={isActive}>
      <Link href={href} passHref>
        <a onClick={isActive ? undefined : context.close}>
          {children}
        </a>
      </Link>
    </Box>
  )
}
export default UiDropdownLink

const Box = styled(UiDropdownItemBox)<{ isActive: boolean }>`
  > a {
    text-decoration: none;
    color: var(--color);
  }

  ${({ isActive }) => isActive && css`
    cursor: default;
    :hover, :active {
      filter: none;
    }
    > a {
      font-weight: bold;
      cursor: default;
    }
  `}
`
