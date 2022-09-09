import { KitIcon } from '@pfadiolten/react-kit'
import { theme } from '@pfadiolten/react-kit'
import { run } from '@/utils/control-flow'
import { StyleProps } from '@/utils/props'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface Props extends StyleProps {
  name: string
  href?: string
  onClick?: () => void
  isOpenDropdown?: boolean
  children?: ReactNode
}

const PageNavItem: React.FC<Props> = ({ name, href, onClick, isOpenDropdown, children }) => {
  const path = useRouter().asPath.toLowerCase()
  const isActive = href === undefined
    ? false
    : path.startsWith(href.toLowerCase())

  return (
    <Wrapper isActive={isActive}>
      {href ? (
        <Link href={href}>
          <a onClick={onClick}>
            <LinkName data-name={name}>
              {name}
            </LinkName>
            {children}
          </a>
        </Link>
      ) : (
        <span onClick={onClick}>
          <LinkName data-name={name}>
            {name}
          </LinkName>
          {isOpenDropdown !== undefined && (
            <DropdownIcon isOpen={isOpenDropdown} size={0.75} />
          )}
          {children}
        </span>
      )}
    </Wrapper>
  )
}
export default PageNavItem

const LinkName = styled.span``
const DropdownIcon = styled(KitIcon.PullDown)<{ isOpen: boolean }>`
  ${({ isOpen }) => isOpen && css`
    transform: translateX(3px) rotate(180deg);
  `}
`
const Wrapper = styled.li<{ isActive: boolean }>`
  --hover-letter-spacing: 0.05em;

  cursor: pointer;
  
  &, > span {
    display: inline-flex;
    align-items: center;
  }
  
  ${({ isActive }) => !isActive && css`
    ${LinkName} + ${KitIcon} {
      transition: ${theme.transitions.fade};
      transition-property: transform;
      margin-left: 0.1rem;
    }
    &:hover {
      letter-spacing: var(--hover-letter-spacing);

      ${LinkName} + ${KitIcon}:not(${DropdownIcon}) {
        transform: translateX(3px);
      }
    }
  `}
  
  a, ${LinkName} {
    color: ${theme.colors.primary.contrast};
    text-decoration: none;
  }
  
  ${LinkName} {
    display: inline-block;
    text-align: center;
    transition-property: letter-spacing, font-weight;
    transition-duration: 300ms;
    white-space: nowrap;

    ${({ isActive }) => isActive && css`
      font-weight: bold;
      cursor: default;
      animation: congest-letters 300ms ease;
      
      @keyframes congest-letters {
        from {
          letter-spacing: var(--hover-letter-spacing);
        }
        to {
          letter-spacing: 0;
        }
      }
    `}

    // Invisible pseudo element with hover/active styles.
    // Makes space so that the nav item does not shift its siblings around when applying these styles itself.
    &::before {
      display: block;
      content: attr(data-name);
      font-weight: bold;
      letter-spacing: var(--hover-letter-spacing);
      height: 1px;
      color: transparent;
      overflow: hidden;
      visibility: hidden;
    }
  }
`
