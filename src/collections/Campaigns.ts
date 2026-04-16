import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  labels: { singular: 'Campaign', plural: 'Campaigns' },
  admin: {
    useAsTitle: 'company',
    group: 'Content',
    defaultColumns: ['company', 'role', 'startDate', 'isCurrent', 'updatedAt'],
  },
  defaultSort: '-startDate',
  access: { read: () => true },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'isCurrent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if this is your current position. Hides end date.',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        condition: (data) => !data?.isCurrent,
        description: 'Leave empty if current.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'questRewards',
      type: 'array',
      label: 'Quest Rewards / Achievements',
      fields: [
        {
          name: 'achievementName',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'e.g. Launched SPC platform for 1500+ students' },
        },
      ],
    },
  ],
}
