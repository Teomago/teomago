import type { GlobalConfig } from 'payload'

export const Skills: GlobalConfig = {
  slug: 'skills',
  label: 'Skills',
  admin: {
    group: 'Content',
    description: 'Structured skills inventory displayed in the Skills Panel alongside Campaigns.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'groups',
      type: 'array',
      label: 'Skill Groups',
      fields: [
        {
          name: 'groupName',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'e.g. Development, Music, Education' },
        },
        {
          name: 'categories',
          type: 'array',
          fields: [
            {
              name: 'categoryName',
              type: 'text',
              required: true,
              localized: true,
              admin: { placeholder: 'e.g. Frontend, Backend, Jazz' },
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'itemName',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: { placeholder: 'e.g. TypeScript, Jazz Piano' },
                },
                {
                  name: 'level',
                  type: 'number',
                  min: 1,
                  max: 99,
                  admin: { description: '1–99 optional skill level.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
