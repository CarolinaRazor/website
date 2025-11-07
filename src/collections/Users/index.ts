import type {CollectionConfig} from 'payload'

import {authenticated} from '@/access/authenticated'
import {createAuthor} from "@/collections/Users/hooks/createAuthor";

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'jobTitle'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'avatars',
      required: false,
      admin: {
        description: 'Optional profile picture for authors',
      },
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
      name: 'page',
      type: 'number',
      // relationTo: 'authors',
      required: false,
      admin: {
        // hidden: true
      }
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [],
    afterDelete: [],
    afterOperation: [createAuthor]
  },
}
