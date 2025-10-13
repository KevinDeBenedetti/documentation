/**
 * Converts a doc ID or stem to a valid slug.
 * Accepts values like:
 * - 'content/fr/1.devops/4.docker.md'
 * - 'fr/1.devops/6.firewall' (stem)
 *
 * Process:
 * - Remove 'content/' if present
 * - Remove language prefix before first '/'
 * - Remove '.md' extension
 * - Replace dots and slashes with hyphens, normalize accents, lowercase and clean
 */
export function docIdToSlug (idOrStem: string): string {
  // Remove "content/" prefix if present
  let slug = idOrStem.replace(/^content\//, '')

  // Remove language prefix before the first slash (e.g., "fr/")
  slug = slug.replace(/^[a-z]{2}\//, '')

  // Remove leading/trailing slashes and .md extension
  slug = slug.replace(/^\/|\/$/g, '').replace(/\.md$/i, '')

  // Normalize accents
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Replace dots and slashes with hyphens
  slug = slug.replace(/[/.]/g, '-')

  // Convert to lowercase
  slug = slug.toLowerCase()

  // Replace invalid characters with hyphens
  slug = slug.replace(/[^a-z0-9_-]+/g, '-')

  // Remove consecutive hyphens and trim
  slug = slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '')

  return slug
}

/**
 * Converts a slug back to a stem (lang/...). Example:
 * - slug '1-devops-6-firewall' with lang 'fr' -> 'fr/1.devops/6.firewall'
 *
 * Algorithm:
 * - Split slug by '-' and group parts into segments starting at numeric parts
 * - For each segment like '1-devops' replace first hyphen with a dot -> '1.devops'
 * - Join segments with '/' and prepend lang
 */
export function slugToDocId (slug: string, lang: string): string {
  const parts = slug.split('-')
  const segments: string[] = []
  let currentSegment: string[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    // If a numeric part appears and there's an existing current segment,
    // start a new segment (e.g., ['1','devops','6','firewall'] -> ['1-devops','6-firewall'])
    if (/^\d+$/.test(part) && currentSegment.length > 0) {
      segments.push(currentSegment.join('-'))
      currentSegment = [part]
    } else {
      currentSegment.push(part)
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment.join('-'))
  }

  const formattedSegments = segments.map((segment) => {
    const match = segment.match(/^(\d+)-(.+)$/)
    if (match) {
      return `${match[1]}.${match[2]}`
    }
    return segment
  })

  const path = formattedSegments.join('/')

  // Return stem (without 'content/' and without '.md')
  return `${lang}/${path}`
}