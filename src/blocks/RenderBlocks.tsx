import React, {Fragment} from 'react'

import type {Page, Post} from '@/payload-types'

import {ArchiveBlock} from '@/blocks/ArchiveBlock/Component'
import {CallToActionBlock} from '@/blocks/CallToAction/Component'
import {ContentBlock} from '@/blocks/Content/Component'
import {FormBlock} from '@/blocks/Form/Component'
import {MediaBlock} from '@/blocks/MediaBlock/Component'
import {MagazineBlock} from '@/blocks/MagazineBlock/Component'
import {VerticalCategoryStackBlock} from '@/blocks/VerticalCategoryStackBlock/Component'
import {CodeBlock} from '@/blocks/Code/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  magazine: MagazineBlock,
  verticalcategorystackblock: VerticalCategoryStackBlock,
  code: CodeBlock,
}

type BlockType = Page['layout'][0] | Post['layout'][0]

export const RenderBlocks = <T extends BlockType>({blocks}: { blocks: T[] }) => {
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const {blockType} = block as { blockType?: keyof typeof blockComponents }

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]

          if (Block) {
            return (
              <div key={index}>
                {/* @ts-expect-error - Props vary by block type */}
                <Block {...block} disableInnerContainer/>
              </div>
            )
          }
        }

        return null
      })}
    </Fragment>
  )
}
