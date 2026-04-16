import type { CollectionConfig } from 'payload'
import { generateThumbhash } from './hooks/generateThumbhash'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'Images and media files.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [generateThumbhash],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional caption displayed below the image.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      localized: true,
      admin: {
        description: 'Photo credit, e.g. "Photo by Unsplash".',
      },
    },
    {
      name: 'thumbhash',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Base64 ThumbHash for blur placeholder. Auto-generated on upload.',
      },
    },
  ],
  upload: {
    formatOptions: { format: 'webp', options: { quality: 85 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    disableLocalStorage: true,
  },
}
