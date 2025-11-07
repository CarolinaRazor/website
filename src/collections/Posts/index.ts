import type {CollectionConfig} from 'payload'

import {authenticated} from '@/access/authenticated'
import {authenticatedOrPublished} from '@/access/authenticatedOrPublished'
import {generatePreviewPath} from '@/utilities/generatePreviewPath'
import {populateAuthors} from './hooks/populateAuthors'
import {revalidateDelete, revalidatePost} from './hooks/revalidatePost'
import {slugField} from '@/fields/slug'

import {Banner} from '@/blocks/Banner/config'
import {Code} from '@/blocks/Code/config'
import {MediaBlock} from '@/blocks/MediaBlock/config'
import {CallToAction} from '@/blocks/CallToAction/config'
import {Content} from '@/blocks/Content/config'
import {FormBlock} from '@/blocks/Form/config'
import {MagazineBlock} from '@/blocks/MagazineBlock/config'
import {VerticalCategoryStackBlock} from '@/blocks/VerticalCategoryStackBlock/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({data, req}) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        }),
    },
    preview: (data, {req}) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              admin: {
                initCollapsed: true,
              },
              blocks: [
                Banner,
                Code,
                MediaBlock,
                CallToAction,
                Content,
                FormBlock,
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({id}) => ({
                id: {not_in: [id]},
              }),
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {pickerAppearance: 'dayAndTime'},
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({siblingData, value}) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        // update: () => false,
      },
      admin: {
        // disabled: true,
        // readOnly: true,
      },
      fields: [
        {name: 'id', type: 'text'},
        {name: 'name', type: 'text'},
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'avatars',
        },
        {
          name: 'jobTitle',
          type: 'text',
          required: false,
          admin: {
            description: 'Job Title',
          },
        },
        {
          name: "authorPage",
          type: "number",
          required: false,
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
