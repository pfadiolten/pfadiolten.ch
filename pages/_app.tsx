import PageView from '@/components/Page/View/PageView'
import store from '@/store'
import { localeDE, setLocale as setValidateLocale } from '@daniel-va/validate'
import { defaultTheme, KitProvider } from '@pfadiolten/react-kit'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import 'reset-css/reset.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <KitProvider theme={defaultTheme}>
        <ReduxProvider store={store}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <PageView>
            <Component {...pageProps} />
          </PageView>
        </ReduxProvider>
      </KitProvider>
    </SessionProvider>
  )
}
export default App

setValidateLocale(localeDE)
