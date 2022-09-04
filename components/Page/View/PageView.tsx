import PageContext, { PageState } from '@/components/Page/Context/PageContext'
import PageFooter from '@/components/Page/Footer/PageFooter'
import PageNav from '@/components/Page/Nav/PageNav'
import { KitContainer, theme } from '@pfadiolten/react-kit'
import Head from 'next/head'
import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'

interface Props {
  children?: ReactNode
}

const PageView: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<PageState>(() => ({
    title: '',
    noBackground: false,
    update(state) {
      setState((prev) => ({ ...prev, ...state }))
    },
  }))
  return (
    <Box>
      <Head>
        <title key="title">
          {state.title ? (
            `${state.title} ⚜️ Pfadi Olten`
          ) : (
            'Pfadi Olten'
          )}
        </title>
      </Head>
      <PageNav noBackground={state.noBackground} />
      <Main as="main">
        <PageContext.Provider value={state}>
          {children}
        </PageContext.Provider>
      </Main>
      <PageFooter state={state} />
    </Box>
  )
}
export default PageView

const Box = styled.div`
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
`
const Main = styled(KitContainer)`
  --main-height: calc(100vh - 4rem - 1em);
  
  position: relative;
  width: 100vw;
  min-height: var(--main-height);
  padding-top: ${theme.spacing(16)};
  padding-bottom: ${theme.spacing(16)};
`
