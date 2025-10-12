/**
 * Converts a doc ID to a valid slug
 * Example: "content/fr/1.devops/4.docker.md" -> "1-devops-4-docker-md"
 */
export function docIdToSlug (id: string): string {
  // Remove "content/" prefix
  let slug = id.replace(/^content\//, '')
  
  // Remove language prefix (fr/, en/, etc.)
  slug = slug.replace(/^[a-z]{2}\//, '')
  
  // Normalize accents
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Convert to lowercase
  slug = slug.toLowerCase()
  
  // Replace invalid characters with hyphens
  slug = slug.replace(/[^a-z0-9_-]/g, '-')
  
  // Remove consecutive hyphens
  slug = slug.replace(/-+/g, '-')
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '')
  
  // Remove language prefix from slug if present (e.g., "fr-" at the start)
  slug = slug.replace(/^[a-z]{2}-/, '')
  
  return slug
}

/**
 * Converts a slug back to a doc ID
 * Example: "1-devops-2-git" with lang "fr" -> "content/fr/1.devops/2.git.md"
 * 
 * The function reconstructs the path structure by:
 * 1. Identifying number-prefixed segments (e.g., "1-devops", "2-git")
 * 2. Replacing the first hyphen after each number with a dot
 * 3. Separating segments with slashes
 * 4. Adding .md extension if not present
 */
export function slugToDocId (slug: string, lang: string): string {
  // Split by hyphens to process segments
  const parts = slug.split('-')
  const segments: string[] = []
  let currentSegment: string[] = []
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    
    // Check if this part is a number and starts a new segment
    if (/^\d+$/.test(part) && currentSegment.length > 0) {
      // Save the previous segment
      segments.push(currentSegment.join('-'))
      currentSegment = [part]
    } else {
      currentSegment.push(part)
    }
  }
  
  // Add the last segment
  if (currentSegment.length > 0) {
    segments.push(currentSegment.join('-'))
  }
  
  // Convert each segment to "number.name" format
  const formattedSegments = segments.map((segment) => {
    const match = segment.match(/^(\d+)-(.+)$/)
    if (match) {
      return `${match[1]}.${match[2]}`
    }
    return segment
  })
  
  // Join with slashes and add .md extension if not present
  let path = formattedSegments.join('/')
  if (!path.endsWith('.md')) {
    path += '.md'
  }
  
  return `content/${lang}/${path}`
}