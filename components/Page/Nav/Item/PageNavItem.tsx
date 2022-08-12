import UiIcon from '@/components/Ui/UiIcon'
import theme from '@/theme-utils'
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
  children?: ReactNode
}

const PageNavItem: React.FC<Props> = ({ name, href, onClick, children }) => {
  const path = useRouter().asPath.toLowerCase()
  const isActive = run(() => {
    if (!href) {
      return false
    }
    return path.startsWith(href.toLowerCase())
  })

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
          {children}
        </span>
      )}
    </Wrapper>
  )
}
export default PageNavItem

const LinkName = styled.span``
const Wrapper = styled.li<{ isActive: boolean }>`
  --hover-letter-spacing: 0.05em;
  
  display: inline-flex;
  align-items: center;


  ${({ isActive }) => !isActive && css`
    &:hover {
      letter-spacing: var(--hover-letter-spacing);

      ${LinkName} + ${UiIcon} {
        transform: translateX(3px);
      }
    }
    
    ${LinkName} + ${UiIcon}:last-child {
      transition: 250ms ease-out;
      transition-property: transform;
      margin-left: 0.3rem;
    }
  `}
  
  a, ${LinkName} {
    color: ${theme.colors.primary.contrast};
    text-decoration: none;
  }
  
  ${LinkName} {
    cursor: pointer;
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
