import {CollectionConfig} from 'payload'

import {authenticated} from '@/access/authenticated'
import {createAuthor} from "@/collections/Users/hooks/createAuthor";
import {protectRoles} from "@/collections/Users/hooks/protectRoles"
import user from "@/collections/Users/access/user";
import admin from "@/collections/Users/access/admin";
import {checkRole} from "@/collections/Users/access/checkRole";
import {User} from '@/payload-types'


export const Users: CollectionConfig = {
  slug: 'users',
  // access: {
  //   admin: authenticated,
  //   create: authenticated,
  //   delete: authenticated,
  //   read: authenticated,
  //   update: authenticated,
  // },
  access: {
    create: admin,
    read: user,
    update: ({ req: { user } }) => {
      if (checkRole(['admin'], user as User)) {
        return true;
      }
      return {
        id: { equals: user?.id }
      };
    },
    delete: admin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'jobTitle'],
    useAsTitle: 'name',
    group: 'Users',
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
        description: 'Friendly title for position.',
      },
      access: {
        update: ({req: {user}}) => checkRole(['admin'], user as User)
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        {label: 'Admin', value: 'admin'},
        {label: 'Super Editor', value: 'seditor'},
        {label: 'Super Author', value: 'sauthor'},
        {label: 'Editor', value: 'editor'},
        {label: 'Author', value: 'author'},
        {label: 'User', value: 'user'},
      ],
      required: true,
      hooks: {
        beforeChange: [protectRoles]
      },
      access: {
        update: ({req: {user}}) => checkRole(['admin'], user as User)
      },
    },
    {
      name: 'page',
      type: 'number',
      // relationTo: 'authors',
      required: false,
      admin: {
        hidden: true
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
