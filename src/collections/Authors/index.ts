import type {CollectionConfig} from 'payload'

import {authenticated} from '@/access/authenticated'
import {authenticatedOrPublished} from '@/access/authenticatedOrPublished'
import {Archive} from '@/blocks/ArchiveBlock/config'
import {CallToAction} from '@/blocks/CallToAction/config'
import {Content} from '@/blocks/Content/config'
import {FormBlock} from '@/blocks/Form/config'
import {MediaBlock} from '@/blocks/MediaBlock/config'
// import { MagazineBlock } from '@/blocks/MagazineBlock/config'
import {slugField} from '@/fields/slug'
// import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import {generatePreviewPath} from '@/utilities/generatePreviewPath'
// import { revalidateDelete, revalidatePage } from '../pages/hooks/revalidatePage'
import {revalidateAuthor, revalidateDelete} from "@/collections/Authors/hooks/revalidateAuthor";
import {populateAuthors} from "@/collections/Authors/hooks/populateAuthors";

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {RichTextBlock} from "@/blocks/RichTextBlock/config";
import admin from "@/collections/Users/access/admin";
import {User} from "@/payload-types";
import {checkRole} from "@/collections/Users/access/checkRole";


export const Authors: CollectionConfig<'authors'> = {
  slug: 'authors',

  access: {
    create: admin,
    delete: admin,
    read: authenticatedOrPublished,
    update: ({ req: { user } }) => {
      if (checkRole(['admin'], user as User)) {
        return true;
      }
      return {
        id: { equals: user?.id }
      };
    },
  },

  admin: {
    group: "Users",
    defaultColumns: ['name', 'slug', 'updatedAt'],
    livePreview: {
      url: ({data, req}) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'authors',
          req,
        })
        return path
      },
    },
    preview: (data, {req}) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'authors',
        req,
      }),
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      admin: {
        hidden: true
      }
    },
    {
      name: 'author_id',
      label: 'User ID',
      type: 'text',
      required: true,
      admin: {
        hidden: true
      }
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                RichTextBlock,
              ],
              admin: {
                initCollapsed: true,
              },
            },
            {
              name: 'populatedAuthors',
              type: 'array',
              access: {
                update: () => false,
              },
              admin: {
                disabled: true,
                readOnly: true,
              },
              fields: [
                {
                  name: 'id',
                  type: 'text',
                },
                {
                  name: 'name',
                  type: 'text',
                },
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
              ],
            },
          ],
        },
        {
          label: 'SEO',
          name: 'meta',
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
        position: 'sidebar',
      },
    },

    ...slugField(),
  ],

  hooks: {
    afterChange: [revalidateAuthor],
    afterRead: [populateAuthors], //
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
