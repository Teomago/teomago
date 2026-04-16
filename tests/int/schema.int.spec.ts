import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import payload from 'payload'
import config from '@/payload.config'

const mockDesc = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Test description',
            version: 1,
          },
        ],
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

beforeAll(async () => {
  await payload.init({ config })
}, 60000)

afterAll(async () => {
  try {
    await payload.delete({ collection: 'quests', where: { id: { exists: true } } })
    await payload.delete({ collection: 'stats', where: { id: { exists: true } } })
    await payload.delete({ collection: 'campaigns', where: { id: { exists: true } } })
  } catch {
    // ignore cleanup errors
  }
})

describe('Payload schema — Phase 2A', () => {
  it('creates a Quest document', async () => {
    const quest = await payload.create({
      collection: 'quests',
      draft: false,
      data: {
        title: 'Test Quest',
        category: 'tech',
        questStatus: 'completed',
        sortOrder: 1,
        _status: 'published',
        description: mockDesc,
      } as any,
    })
    expect(quest.id).toBeDefined()
    expect(quest.slug).toBe('test-quest')
  })

  it('rejects duplicate Quest slugs', async () => {
    await payload.create({
      collection: 'quests',
      draft: false,
      data: {
        title: 'Duplicate Quest',
        slug: 'duplicate-quest',
        category: 'tech',
        questStatus: 'completed',
        sortOrder: 99,
        _status: 'published',
        description: mockDesc,
      },
    })
    await expect(
      payload.create({
        collection: 'quests',
      draft: false,
        data: {
          title: 'Another Quest',
          slug: 'duplicate-quest',
          category: 'tech',
          questStatus: 'completed',
          sortOrder: 99,
          _status: 'published',
          description: mockDesc,
        },
      })
    ).rejects.toThrow()
  })

  it('creates a Stat document', async () => {
    const stat = await payload.create({
      collection: 'stats',
      data: { name: 'TypeScript', level: 88, category: 'frontend', icon: 'Code' },
    })
    expect(stat.id).toBeDefined()
  })

  it('creates a Campaign document', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: {
        company: 'Test Co',
        role: 'Developer',
        startDate: '2022-01-01T00:00:00.000Z',
        isCurrent: false,
        endDate: '2023-01-01T00:00:00.000Z',
        description: mockDesc,
        questRewards: [],
      },
    })
    expect(campaign.id).toBeDefined()
  })

  it('hides endDate when isCurrent is true', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: {
        company: 'Current Co',
        role: 'Lead Dev',
        startDate: '2024-01-01T00:00:00.000Z',
        isCurrent: true,
        description: mockDesc,
        questRewards: [],
      },
    })
    expect(campaign.isCurrent).toBe(true)
    expect(campaign.endDate).toBeNull()
  })
})

describe('Skills global', () => {
  it('returns groups array in es locale', async () => {
    const skills = await payload.findGlobal({ slug: 'skills', locale: 'es' })
    expect(Array.isArray(skills.groups)).toBe(true)
  })

  it('returns groups array in en locale', async () => {
    const skills = await payload.findGlobal({ slug: 'skills', locale: 'en' })
    expect(Array.isArray(skills.groups)).toBe(true)
  })
})

describe('SiteSettings global', () => {
  it('returns a non-empty siteName', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    expect(typeof settings.siteName).toBe('string')
    expect(settings.siteName.length).toBeGreaterThan(0)
  })
})
