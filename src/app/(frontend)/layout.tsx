import React from 'react'
import type {Metadata} from 'next'
import {cn} from '@/utilities/ui'
// import {GeistMono} from 'geist/font/mono'
// import {GeistSans} from 'geist/font/sans'
import {Inter, Playfair_Display, Source_Serif_4} from 'next/font/google'
import {AdminBar} from '@/components/AdminBar'
import {Footer} from '@/Footer/Component'
import {Header} from '@/Header/Component'
import {Providers} from '@/providers'
import {InitTheme} from '@/providers/Theme/InitTheme'
import {mergeOpenGraph} from '@/utilities/mergeOpenGraph'
import {draftMode} from 'next/headers'
import {getServerSideURL} from '@/utilities/getURL'

import './globals.css'
import BreakingHeaderServer from "@/components/BreakingNewsHeaderServer";


const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSerif = Source_Serif_4({
  subsets: ["latin"],
  // weight: ["390"],
  variable: "--font-bodyserif",
  // style: "normal"
})

export default async function RootLayout({children}: { children: React.ReactNode }) {
  const {isEnabled} = await draftMode()

  return (
    <html className={cn(playfair.variable, inter.variable, notoSerif.variable)} lang="en" suppressHydrationWarning>
    <head>
      <link
        rel="stylesheet"
        href="https://use.typekit.net/yna8bmx.css"
      />
      <script defer src="https://analytics.liberatorch.com/script.js" data-website-id="23711cc5-b98b-48ee-a037-09f37d07f433"></script>
      <InitTheme/>
      <link href="/favicon.ico" rel="icon" sizes="32x32"/>
      <link href="/favicon-light.svg" rel="icon" media="(prefers-color-scheme: dark)" type="image/svg+xml"/>
      <link href="/favicon-dark.svg" rel="icon" media="(prefers-color-scheme: light)" type="image/svg+xml"/>
    </head>
    <body>
    <Providers>
      <AdminBar
        adminBarProps={{
          preview: isEnabled,
        }}
      />
      <Header/>
      <BreakingHeaderServer/>
      <div className={"pb-3"}></div>
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
