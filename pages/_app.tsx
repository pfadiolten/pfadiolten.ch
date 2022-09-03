import PageView from '@/components/Page/View/PageView'
import store from '@/store'
import { defaultTheme } from '@/theme'
import theme from '@/theme-utils'
import { localeDE, setLocale as setValidateLocale } from '@daniel-va/validate'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useMemo } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import 'reset-css/reset.css'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <ThemeProvider theme={defaultTheme}>
        <ReduxProvider store={store}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <GlobalStyle />
          <PageView>
            <Component {...pageProps} />
          </PageView>
        </ReduxProvider>
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
