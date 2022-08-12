import PageContext, { PageState } from '@/components/Page/Context/PageContext'
import PageFooter from '@/components/Page/Footer/PageFooter'
import PageNav from '@/components/Page/Nav/PageNav'
import UiContainer from '@/components/Ui/UiContainer'
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
    <Container>
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
      <Main>
        <UiContainer>
          <PageContext.Provider value={state}>
            {children}
          </PageContext.Provider>
        </UiContainer>
      </Main>
      <PageFooter state={state} />
    </Container>
  )
}
export default PageView

const Container = styled.div`
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
`

const Main = styled.main`
  width: 100vw;
  margin-top: 8rem;
  padding-bottom: 8rem;
`
