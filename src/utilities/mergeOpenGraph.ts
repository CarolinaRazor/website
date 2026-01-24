import type {Metadata} from 'next'
import {getServerSideURL} from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'UNC\'s Progressive Student Newspaper',
  images: [
    {
      url: `${getServerSideURL()}/logo_tagline_text.svg`,
    },
  ],
  siteName: 'The LiberatorCH',
  title: 'The LiberatorCH',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
