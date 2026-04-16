import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero — Character Sheet',
  admin: {
    group: 'Content',
    description: 'The landing page character sheet.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Mateo Ibagón',
      admin: { description: 'Your full name.' },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Full-Stack Developer · Musician · Arts Educator',
      admin: { description: 'Your headline role.' },
    },
    {
      name: 'bio',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Your bio. Displayed in the Hero section.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo. Falls back to the default mockup image.',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Core Stats (RPG)',
      admin: {
        description: 'Max 6 stats. Displayed as RPG progress bars in the Hero.',
        initCollapsed: false,
      },
      maxRows: 6,
      fields: [
        {
          name: 'statName',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'e.g. TypeScript, Jazz Piano' },
        },
        {
          name: 'value',
          type: 'number',
          required: true,
          min: 1,
          max: 99,
          defaultValue: 75,
          admin: { description: '1–99 RPG stat value.' },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { placeholder: 'GitHub' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { placeholder: 'https://github.com/...' },
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'Link',
          options: [
            { label: 'GitHub', value: 'Github' },
            { label: 'LinkedIn', value: 'Linkedin' },
            { label: 'Twitter / X', value: 'Twitter' },
            { label: 'Instagram', value: 'Instagram' },
            { label: 'YouTube', value: 'Youtube' },
            { label: 'Mail', value: 'Mail' },
            { label: 'External Link', value: 'ExternalLink' },
            { label: 'Link', value: 'Link' },
          ],
        },
      ],
    },
  ],
}
