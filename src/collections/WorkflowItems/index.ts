import type {CollectionConfig} from 'payload'
import {authenticated} from '@/access/authenticated'
import author from '@/collections/Users/access/author'
import {notifyWorkflowChange} from './hooks/notifyWorkflowChange'

export const WorkflowItems: CollectionConfig = {
  slug: 'workflow-items',
  labels: {
    singular: 'Task',
    plural: 'Tasks',
  },
  access: {
    create: author,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'status', 'createdBy', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Workflow',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/BackToDashboard'],
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Brief title or description of the workflow item',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Additional details about this item',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'idea',
      required: true,
      options: [
        { label: 'Idea', value: 'idea' },
        { label: 'Being Written', value: 'writing' },
        { label: 'Ready for Editing', value: 'ready-edit' },
        { label: 'Being Edited', value: 'editing' },
        { label: 'Being Uploaded', value: 'uploading' },
        { label: 'Ready for Publishing', value: 'ready-publish' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'linkedPost',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        position: 'sidebar',
        description: 'Optional: Link to a post if one has been created',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create') {
              return req.user?.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Assign users to work on this item',
      },
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      admin: {
        description: 'Add relevant links for this workflow item',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Label for the link (e.g., "Google Doc", "Research")',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'URL of the link',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [notifyWorkflowChange],
  },
  timestamps: true,
}
