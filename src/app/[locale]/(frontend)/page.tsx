import { getPayload } from 'payload'
import config from '@/payload.config'
import { HeroSection } from '@/components/homepage/HeroSection'
import { StatsSection } from '@/components/homepage/StatsSection'
import { QuestsSection } from '@/components/homepage/QuestsSection'
import { CampaignsSection } from '@/components/homepage/CampaignsSection'
import { SkillsPanel } from '@/components/homepage/SkillsPanel'
import { LocaleSwitcher } from '@/components/homepage/LocaleSwitcher'
import type { Metadata } from 'next'

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?w=900&auto=format&fit=crop&q=60'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayload({ config })
  const [hero, settings] = await Promise.all([
    payload.findGlobal({ slug: 'hero', locale: locale as 'en' | 'es' }),
    payload.findGlobal({ slug: 'site-settings', locale: locale as 'en' | 'es' }),
  ])
  return {
    title: `${(settings as any)?.siteName ?? 'Teomago'} — ${hero?.properName ?? 'Portfolio'}`,
    description: hero?.role ?? (settings as any)?.siteTagline ?? '',
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const payload = await getPayload({ config })

  const [hero, statsResult, questsResult, campaignsResult, skillsResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero', locale: locale as 'en' | 'es' }),
    payload.find({ collection: 'stats', sort: '-level', limit: 24, locale: locale as 'en' | 'es' }),
    payload.find({
      collection: 'quests',
      sort: 'sortOrder',
      limit: 20,
      locale: locale as 'en' | 'es',
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'campaigns',
      sort: '-startDate',
      limit: 10,
      locale: locale as 'en' | 'es',
    }),
    payload.findGlobal({ slug: 'skills', locale: locale as 'en' | 'es' }),
  ])

  return (
    <main className="min-h-screen bg-void relative">
      <div className="absolute top-4 right-4 z-50">
        <LocaleSwitcher />
      </div>
      <HeroSection hero={hero} defaultAvatar={DEFAULT_AVATAR} />
      <StatsSection stats={statsResult.docs} />
      <QuestsSection quests={questsResult.docs} defaultCover={DEFAULT_AVATAR} />
      
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 lg:gap-8">
        <div className="lg:col-span-6">
          <CampaignsSection campaigns={campaignsResult.docs} />
        </div>
        <div className="lg:col-span-4">
          <SkillsPanel skills={skillsResult} />
        </div>
      </div>
    </main>
  )
}
