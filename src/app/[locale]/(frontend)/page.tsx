import { getPayload } from 'payload'
import config from '@/payload.config'
import { HeroSection } from '@/components/homepage/HeroSection'
import { StatsSection } from '@/components/homepage/StatsSection'
import { QuestsSection } from '@/components/homepage/QuestsSection'
import { CampaignsSection } from '@/components/homepage/CampaignsSection'
import { LocaleSwitcher } from '@/components/homepage/LocaleSwitcher'
import type { Metadata } from 'next'

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?w=900&auto=format&fit=crop&q=60'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })
  const hero = await payload.findGlobal({ slug: 'hero' })
  return {
    title: `Teomago — ${hero?.name ?? 'Portfolio'}`,
    description: hero?.role ?? 'Full-Stack Developer · Musician · Arts Educator',
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [hero, statsResult, questsResult, campaignsResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero' }),
    payload.find({ collection: 'stats', sort: '-level', limit: 24 }),
    payload.find({ collection: 'quests', sort: 'sortOrder', limit: 20, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'campaigns', sort: '-startDate', limit: 10 }),
  ])

  return (
    <main className="min-h-screen bg-void relative">
      <div className="absolute top-4 right-4 z-50">
        <LocaleSwitcher />
      </div>
      <HeroSection hero={hero} defaultAvatar={DEFAULT_AVATAR} />
      <StatsSection stats={statsResult.docs} />
      <QuestsSection quests={questsResult.docs} defaultCover={DEFAULT_AVATAR} />
      <CampaignsSection campaigns={campaignsResult.docs} />
    </main>
  )
}
