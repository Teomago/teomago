import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Config',
    description: 'Stable SEO and branding settings. Decoupled from content that can change over time.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Teomago',
      admin: { description: 'Site name used in SEO titles (e.g. "Teomago — Portfolio").' },
    },
    {
      name: 'siteTagline',
      type: 'text',
      localized: true,
      defaultValue: 'Full-Stack Developer · Musician · Arts Educator',
      admin: { description: 'Default meta description when page-specific description is unavailable.' },
    },
  ],
}
