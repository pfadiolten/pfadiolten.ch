import Page from '@/components/Page/Page'
import useBool from '@/hooks/useBool'
import { KitButton, KitDrawer, theme } from '@pfadiolten/react-kit'
import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

const Organigram: NextPage = () => {
  return (
    <Page title="Organigram">
      <Box>
        <OrgList>
          <li>
            <Org name="Biberstufe">
              Biberstufe
            </Org>
            <VLine />
            <HLine />
          </li>
          <li>
            <Org name="Wolfsstufe">
              Wolfsstufe
            </Org>
            <VLine />
            <HLine />
          </li>
          <li>
            <Org name="Pfadistufe">
              Pfadistufe
            </Org>
            <VLine />
            <HLine />
          </li>
          <li>
            <Org name="Piostufe">
              Piostufe
            </Org>
            <VLine />
            <HLine />
          </li>
          <li>
            <Org name="Roverstufe">
              Roverstufe
            </Org>
            <VLine />
            <HLine />
          </li>
        </OrgList>
        <VLine noGap />
        <Org name="Stufenleitung">
          Stufenleitung
        </Org>
        <VLine noGap />
        <Org name="Abteilungsleitung">
          Abteilungsleitung
        </Org>
        <VLine noGap />
        <Org name="Vorstand">
          Vorstand
        </Org>
        <VLine noGap />

        <OrgList style={{ paddingInline: '5rem' }}>
          <li>
            <HLine />
            <VLine />
            <Org name="APV">
              APV
            </Org>
          </li>
          <li>
            <HLine />
            <VLine />
            <Org name="Heimverein">
              Heimverein
            </Org>
          </li>
          <li>
            <HLine />
            <VLine />
            <Org name="Projekt Heimsituation">
              Projekt Heimsituation
            </Org>
          </li>
        </OrgList>
      </Box>
    </Page>
  )
}
export default Organigram

interface OrgProps {
  name: string
  children: ReactNode
}

const Org: React.FC<OrgProps> = ({ name, children }) => {
  const [isOpen, setOpen] = useBool()
  return (
    <React.Fragment>
      <OrgButton onClick={setOpen.on}>
        {name}
      </OrgButton>
      <KitDrawer isOpen={isOpen} onClose={setOpen.off} position="right">
        {children}
      </KitDrawer>
    </React.Fragment>
  )
}

const Box = styled.div`
  --line-height: calc(1em + ${theme.spacing(1)});
  
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
`
const VLine = styled.div<{ noGap?: boolean }>`
  position: relative;
  width: 100%;
  height: var(--line-height);
  ::before {
    display: block;
    content: " ";
    background-color: ${theme.colors.secondary.contrast};
    height: 100%;
    width: 1px;
    
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  ${({ noGap }) => noGap && css`
    margin-block: calc(${theme.spacing(1)} * -1);
  `}
`
const HLine = styled.div`
  position: relative;
  width: 100%;
  height: 1px;
  ::before {
    display: block;
    content: " ";
    background-color: ${theme.colors.secondary.contrast};
    height: 1px;
    width: calc(100% + ${theme.spacing(1)});

    position: absolute;
    left: calc(${theme.spacing(0.5)} * -1);
  }
`
const OrgButton = styled(KitButton).attrs((props) => ({ color: 'tertiary', ...props }))`
  background-color: ${theme.color};
  color: ${theme.color.contrast};
  border: 1px solid ${theme.color.contrast};
  width: 100%;
`
const OrgList = styled.ul`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: ${theme.spacing(1)};
  
  > li {
    width: 100%;
    
    :first-child > ${HLine} {
      width: 50%;
      left: calc(50% + ${theme.spacing(0.5)});
    }
    :last-child > ${HLine} {
      width: calc(50% - ${theme.spacing(0.5)} + 1px);
      left: 0;
    }
  }
`
