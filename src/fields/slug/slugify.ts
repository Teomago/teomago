import format from 'slugify'

/**
 * Converts a human readable string into a URL safe slug.
 */
export const slugify = (value: string): string => {
  return format(value, { lower: true, strict: true })
}

export default slugify
