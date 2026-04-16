import { describe, it, expect } from 'vitest'
import { generateThumbhash } from '@/collections/hooks/generateThumbhash'
import sharp from 'sharp'

describe('generateThumbhash hook', () => {
  it('generates a base64 thumbhash string for a valid image buffer', async () => {
    // Create a minimal 10x10 red PNG buffer via sharp
    const buffer = await sharp({
      create: { width: 10, height: 10, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } },
    })
      .png()
      .toBuffer()

    const result = await (generateThumbhash as any)({
      data: {},
      req: { file: { data: buffer, mimetype: 'image/png' } } as any,
      operation: 'create',
      originalDoc: undefined,
      context: {},
    } as any)

    expect(typeof result.thumbhash).toBe('string')
    expect(result.thumbhash.length).toBeGreaterThan(0)
    // valid base64
    expect(() => Buffer.from(result.thumbhash, 'base64')).not.toThrow()
  })

  it('returns data unchanged when no file is present', async () => {
    const data = { alt: 'test' }
    const result = await (generateThumbhash as any)({
      data,
      req: {} as any,
      operation: 'update',
      originalDoc: undefined,
      context: {},
    } as any)

    expect(result).toEqual(data)
    expect(result.thumbhash).toBeUndefined()
  })

  it('returns data unchanged when sharp fails (non-fatal)', async () => {
    const data = { alt: 'corrupt' }
    const result = await (generateThumbhash as any)({
      data,
      req: { file: { data: Buffer.from('not-an-image'), mimetype: 'image/jpeg' } } as any,
      operation: 'create',
      originalDoc: undefined,
      context: {},
    } as any)

    // hook must not throw — thumbhash may be undefined or missing
    expect(result.alt).toBe('corrupt')
  })
})
