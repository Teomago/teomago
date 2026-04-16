import type { CollectionBeforeChangeHook } from 'payload'
import sharp from 'sharp'
import { rgbaToThumbHash } from 'thumbhash'

export const generateThumbhash: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!req.file?.data) return data
  try {
    const { data: pixels, info } = await sharp(req.file.data)
      .resize(100, 100, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const hash = rgbaToThumbHash(info.width, info.height, new Uint8Array(pixels))
    data.thumbhash = Buffer.from(hash).toString('base64')
  } catch (err) {
    console.error('Error generating thumbhash:', err)
    // non-fatal: leave thumbhash empty rather than block the upload
  }
  return data
}
