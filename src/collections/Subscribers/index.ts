import {CollectionConfig} from 'payload'
import {nobody} from "@/collections/Users/access/nobody";
import admin from "@/collections/Users/access/admin";

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    create: admin,
    delete: admin,
    read: admin,
    update: nobody
  },
  labels: {
    singular: 'Subscriber',
    plural: 'Subscribers'
  },
  admin: {
    group: 'Newsletter',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true
    },
    {
      name: 'token',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastSent',
      type: 'date',
      timezone: true,
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'confirmed',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },
  ],
}
