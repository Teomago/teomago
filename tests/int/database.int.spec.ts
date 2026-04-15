import { describe, it, expect, afterAll } from 'vitest'
import postgres from 'postgres'

describe('Neon database connections', () => {
  let pooledClient: ReturnType<typeof postgres> | undefined
  let directClient: ReturnType<typeof postgres> | undefined

  afterAll(async () => {
    if (pooledClient) await pooledClient.end()
    if (directClient) await directClient.end()
  })

  it('connects via pooled DATABASE_URI', async () => {
    const uri = process.env.DATABASE_URI
    expect(uri, 'DATABASE_URI is not defined').toBeDefined()
    
    pooledClient = postgres(uri!, { ssl: 'require' })
    const result = await pooledClient`SELECT 1 AS ok`
    expect(result[0].ok).toBe(1)
  })

  it('connects via direct DATABASE_URI_DIRECT', async () => {
    const uri = process.env.DATABASE_URI_DIRECT
    expect(uri, 'DATABASE_URI_DIRECT is not defined').toBeDefined()
    
    directClient = postgres(uri!, { ssl: 'require' })
    const result = await directClient`SELECT 1 AS ok`
    expect(result[0].ok).toBe(1)
  })
})
