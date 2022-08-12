// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class AppDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Scope+One" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Encode+Sans+Expanded" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Eczar" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default AppDocument
