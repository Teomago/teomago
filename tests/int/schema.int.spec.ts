import { describe, it, expect, beforeAll } from 'vitest'
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
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

beforeAll(async () => {
  await payload.init({ config, local: true })
}, 60000)

describe('Payload schema — Phase 2A', () => {
  it('creates a Quest document', async () => {
    const quest = await payload.create({
      collection: 'quests',
      data: {
        title: 'Test Quest',
        category: 'tech',
        questStatus: 'completed',
        sortOrder: 1,
        description: mockDesc,
      },
    })
    expect(quest.id).toBeDefined()
    expect(quest.slug).toBe('test-quest')
  })

  it('rejects duplicate Quest slugs', async () => {
    await payload.create({
      collection: 'quests',
      data: {
        title: 'Duplicate Quest',
        slug: 'duplicate-quest',
        category: 'tech',
        questStatus: 'completed',
        sortOrder: 99,
        description: mockDesc,
      },
    })
    await expect(
      payload.create({
        collection: 'quests',
        data: {
          title: 'Another Quest',
          slug: 'duplicate-quest',
          category: 'tech',
          questStatus: 'completed',
          sortOrder: 99,
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
