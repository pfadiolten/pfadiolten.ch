import PageView from '@/components/Page/View/PageView'
import theme from '@/theme-utils'
import { localeDE, setLocale as setValidateLocale } from '@daniel-va/validate'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { defaultTheme } from '@/theme'
import 'reset-css/reset.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <ThemeProvider theme={defaultTheme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <GlobalStyle />
        <PageView>
          <Component {...pageProps} />
        </PageView>
      </ThemeProvider>
    </SessionProvider>
  )
}
export default App

setValidateLocale(localeDE)

const GlobalStyle = createGlobalStyle`
  :root {
    ${theme.root};
  }

  * {
    box-sizing: border-box;
  }

  html, body, #__next {
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }

  body {
    font-family: ${theme.fonts.sans};
    line-height: normal;
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.secondary.contrast};
  }
  
  main {
    position: relative;
    min-height: calc(100vh);
    padding-block: 2rem;
  }

  sup {
    vertical-align: super;
  }

  sub {
    vertical-align: sub;
  }

  a {
    color: ${theme.colors.primary};
  }
`
