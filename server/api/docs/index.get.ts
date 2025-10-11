import { join } from 'node:path'
import { getMarkdownFiles } from '#shared/utils/doc'


export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const contentRootDir = join(process.cwd(), 'content')

  try {
    const docs = await getMarkdownFiles(contentRootDir, contentRootDir)

    // Parse available languages from query.langs
    let availableLangs: string[] = []
    if (query.langs && Array.isArray(query.langs)) {
      availableLangs = query.langs
        .map((lang) => {
          try {
            const parsed = JSON.parse(lang as string)
            return parsed.code
          } catch {
            return null
          }
        })
        .filter((code): code is string => code !== null && code !== query.lang)
    }

    // Filter by language if specified
    let filteredDocs = docs
    if (query.lang) {
      filteredDocs = docs.filter((doc) => doc._lang === query.lang)

      // Add translations informations
      if (availableLangs.length > 0) {
        filteredDocs = filteredDocs.map((doc) => {
          const translations = availableLangs
            .map((lang) => {
              // Search for the equivalent document in the other language
              // by replacing the language code in the path
              const translatedPath = doc._path.replace(`/${query.lang}/`, `/${lang}/`)
              const translatedDoc = docs.find((d) => d._path === translatedPath && d._lang === lang)
              
              return translatedDoc ? { lang, path: translatedDoc._path } : null
            })
            .filter((t): t is { lang: string; path: string } => t !== null)

          return {
            ...doc,
            translations
          }
        })
      }
    }

    // Filter by category and then by file order
    filteredDocs.sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder
      if (a.fileOrder !== b.fileOrder) return a.fileOrder - b.fileOrder
      return a.title.localeCompare(b.title)
    })

    return {
      count: filteredDocs.length,
      docs: filteredDocs
    }
  } catch {
    return {
      count: 0,
      docs: [],
      error: 'Directory not found'
    }
  }
})

