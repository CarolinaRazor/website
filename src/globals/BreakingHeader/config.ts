import type {GlobalConfig} from 'payload'
import {FixedToolbarFeature, InlineToolbarFeature, lexicalEditor} from "@payloadcms/richtext-lexical";
import sauthor from "@/collections/Users/access/sauthor";
import seditor from "@/collections/Users/access/seditor";

export const BreakingHeader: GlobalConfig = {
  slug: 'breaking-header',
  access: {
    update: sauthor || seditor
  },
  label: {
    singular: 'Breaking News Header',
    plural: 'Breaking News Header',
  },
  fields: [
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Visible',
      defaultValue: false,
    },
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      editor: lexicalEditor({
        features: ({rootFeatures}) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
}
