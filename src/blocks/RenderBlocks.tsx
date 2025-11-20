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
import {RichTextBlock} from '@/blocks/RichTextBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  magazine: MagazineBlock,
  verticalcategorystackblock: VerticalCategoryStackBlock,
  code: CodeBlock,
  richText: RichTextBlock,
}

type BlockType = Page['layout'][0] | Post['layout'][0]

type BlockWithOptionalFullWidth = BlockType & {
  fullWidth?: boolean | null
}

export const RenderBlocks = ({
                               blocks,
                               constraint = null, // "post" | "page" | null
                             }: {
  blocks: BlockWithOptionalFullWidth[]
  constraint?: 'post' | 'page' | null
}) => {

  const hasBlocks = Array.isArray(blocks) && blocks.length > 0
  if (!hasBlocks) return null

  const constraintClass =
    constraint === 'post'
      ? 'max-w-[48rem]'     // article width
      : constraint === 'page'
        ? 'max-w-[56rem]'   // wider for pages
        : null              // no constraint

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType, fullWidth } = block as {
          blockType?: keyof typeof blockComponents
          fullWidth?: boolean
        }

        if (!blockType || !(blockType in blockComponents)) return null
        const Block = blockComponents[blockType]

        const shouldConstrain =
          constraintClass && !fullWidth

        const inner = (
          // @ts-expect-error – varying block props
          <Block {...block} disableInnerContainer />
        )

        return (
          <div key={index}>
            {shouldConstrain ? (
              <div className={`w-full px-4 sm:px-6 lg:px-0 ${constraintClass} mx-auto flex flex-col gap-6 my-6`}>
                {inner}
              </div>
            ) : (
              inner
            )}
          </div>
        )
      })}
    </Fragment>
  )
}
