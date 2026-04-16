import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { es } from '@payloadcms/translations/languages/es'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Quests } from './collections/Quests'
import { Stats } from './collections/Stats'
import { Campaigns } from './collections/Campaigns'
import { Hero } from './globals/Hero'
import { Skills } from './globals/Skills'
import { SiteSettings } from './globals/SiteSettings'
import { seoPlugin } from '@payloadcms/plugin-seo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  secret: process.env.PAYLOAD_SECRET!,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
    // Direct connection used for migrations (bypasses Neon pooler)
    migrationDir: './migrations',
  }),

  editor: lexicalEditor({}),

  localization: {
    locales: [
      { label: 'Español', code: 'es' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'es',
    fallback: true,
  },

  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: 'es',
  },

  plugins: [
    s3Storage({
      collections: {
        [Media.slug]: true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION ?? 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
    }),
    seoPlugin({
      collections: ['quests'],
      globals: ['hero'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: async ({ doc, req }) => {
        try {
          const settings = await req.payload.findGlobal({ slug: 'site-settings' })
          const siteName = settings?.siteName ?? 'Teomago'
          const suffix = (doc as any)?.title ?? (doc as any)?.name ?? (doc as any)?.properName ?? ''
          return suffix ? `${siteName} — ${suffix}` : siteName
        } catch {
          return 'Teomago'
        }
      },
      generateDescription: async ({ doc, req }) => {
        try {
          const settings = await req.payload.findGlobal({
            slug: 'site-settings',
            locale: (req as any).locale ?? 'es',
          })
          return (doc as any)?.role ?? settings?.siteTagline ?? ''
        } catch {
          return ''
        }
      },
      generateURL: ({ doc, collectionSlug }) =>
        collectionSlug === 'quests'
          ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/quests/${(doc as any)?.slug}`
          : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    }),
  ],

  globals: [Hero, Skills, SiteSettings],
  collections: [Users, Media, Quests, Stats, Campaigns],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
