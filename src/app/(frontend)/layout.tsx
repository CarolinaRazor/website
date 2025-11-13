import React from 'react'
import type {Metadata} from 'next'
import {cn} from '@/utilities/ui'
// import {GeistMono} from 'geist/font/mono'
// import {GeistSans} from 'geist/font/sans'
import {Inter, Playfair_Display} from 'next/font/google'
import {AdminBar} from '@/components/AdminBar'
import {Footer} from '@/Footer/Component'
import {Header} from '@/Header/Component'
import {Providers} from '@/providers'
import {InitTheme} from '@/providers/Theme/InitTheme'
import {mergeOpenGraph} from '@/utilities/mergeOpenGraph'
import {draftMode} from 'next/headers'
import {getServerSideURL} from '@/utilities/getURL'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default async function RootLayout({children}: { children: React.ReactNode }) {
  const {isEnabled} = await draftMode()

  return (
    // GeistSans.variable, GeistMono.variable, onest.variable,
    <html className={cn(playfair.variable, inter.variable)} lang="en" suppressHydrationWarning>
    <head>
      <InitTheme/>
      <link href="/favicon.ico" rel="icon" sizes="32x32"/>
      <link href="/favicon-light.svg" rel="icon" media="(prefers-color-scheme: light)" type="image/svg+xml"/>
      <link href="/favicon-dark.svg" rel="icon" media="(prefers-color-scheme: dark)" type="image/svg+xml"/>
    </head>
    <body>
    <Providers>
      <AdminBar
        adminBarProps={{
          preview: isEnabled,
        }}
      />

      <Header/>
      {children}
      <Footer/>
    </Providers>
    </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
