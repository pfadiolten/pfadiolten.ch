import PageNavItem from '@/components/Page/Nav/Item/PageNavItem'
import UiDropdown from '@/components/Ui/Dropdown/UiDropdown'
import useCurrentUser from '@/hooks/useCurrentUser'
import { KitIcon, theme } from '@pfadiolten/react-kit'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useClickAway, useWindowScroll } from 'react-use'
import styled, { css } from 'styled-components'

interface Props {
  noBackground: boolean
}

const PageNav: React.FC<Props> =  ({ noBackground }) => {
  const [isOpen, setOpen] = useState(false)
  const [isOpaque, setOpaque] = useState(!noBackground)

  const navRef = useRef<HTMLElement>(null)
  useClickAway(navRef, () => {
    setOpen(false)
  })

  const { y } = useWindowScroll()
  useEffect(() => {
    // 40 is just the number which seemed to look and fit the best.
    // Might need some adjustment, especially on different screen sizes.
    if (y > 40) {
      setOpaque(true)
    } else {
      setOpaque(!noBackground)
    }
  }, [y, noBackground])


  const user = useCurrentUser()

  return (
    <Nav ref={navRef} isOpaque={isOpaque}>
      <Logo>
        <Link href="/">
          <a>
            <Image
              src="/logo/pfadi_olten-text.svg"
              alt="Logo der Pfadi Olten"
              width={500}
              height={295}
            />
          </a>
        </Link>
      </Logo>
      <MenuToggle role="button" onClick={() => setOpen((open) => !open)}>
        <KitIcon.Menu />
      </MenuToggle>
      <Menu isOpen={isOpen}>
        <Links>
          <UiDropdown>
            <UiDropdown.Activator>{({ open }) => (
              <PageNavItem name="Abteilung" onClick={open} />
            )}</UiDropdown.Activator>
            <UiDropdown.Menu label="Links zur Abteilung">
              <UiDropdown.Link href="/stufen">
                Stufen
              </UiDropdown.Link>
              <UiDropdown.Link href="/rotten">
                Rotten
              </UiDropdown.Link>
            </UiDropdown.Menu>
          </UiDropdown>

          <PageNavItem name="Jahresprogramm" href="/kalender" />
          <PageNavItem name="Kontakt" href="/kontakt" />

          <MenuOffset>
            {user === null ? (
              <PageNavItem name="anmelden" onClick={() => signIn('midata')}>
                <KitIcon.Login />
              </PageNavItem>
            ) : (
              <PageNavItem name={user.name} onClick={() => signOut()}>
                <KitIcon.Logout />
              </PageNavItem>
            )}
          </MenuOffset>

        </Links>
      </Menu>
    </Nav>
  )
}
export default PageNav

const Nav = styled.nav<{ isOpaque: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  
  z-index: 10;

  background-color: ${theme.colors.primary};
  color: ${theme.colors.primary.contrast};
  
  ${({ isOpaque }) => !isOpaque && css`
    background-color: transparent;
  `}

  font-family: ${theme.fonts.serif};
  font-size: 1.2em;
  
  padding: ${theme.spacing(3)} ${theme.spacing(8)};
  
  transition: 250ms ease-out;
`
const MenuToggle = styled.div`
  display: flex;
  justify-content: right;
  ${theme.media.md.min} {
    display: none;
  }
`
const Links = styled.ol`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`
const Menu = styled.aside<{ isOpen: boolean }>`
  ${theme.media.sm.max} {
    background: ${theme.colors.primary};
    color: ${theme.colors.primary.contrast};
    
    position: fixed;
    top: 0;
    left: 100%;
    height: 100vh;
    box-shadow:
        0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 4px 5px 0 rgba(0, 0, 0, 0.14),
        0 1px 10px 0 rgba(0, 0, 0, 0.12);
    
    ${Links} {
      flex-direction: column;
    }
    
    transition: transform 300ms ease;
    transform-origin: right center;
    ${({ isOpen }) => isOpen && css`
      transform: translateX(-100%);
    `}
  }
`
const MenuOffset = styled.div`
  margin-left: 2rem;
  padding-left: 2rem;
  border-left: 1px solid ${theme.colors.primary.contrast};
  
  ${theme.media.sm.max} {
    margin-left: 0;
    padding-left: 0;
    margin-top: 1rem;
    padding-top: 1rem;
    border-left: none;
    border-top: 1px solid ${theme.colors.primary.contrast};
  }
`
const Logo = styled.div`
  cursor: pointer;
  position: absolute;
  width: 10rem;
  top: 1rem;
  z-index: 10;
  transition: ${theme.transitions.fade};
  transition-property: filter;

  :hover {
    --shadow-color: white;
    --shadow-size: 4px;
    filter:
        drop-shadow(var(--shadow-size) var(--shadow-size) var(--shadow-size) white)
        drop-shadow(calc(var(--shadow-size) * -1) calc(var(--shadow-size) * -1) var(--shadow-size) white);
  }
`
