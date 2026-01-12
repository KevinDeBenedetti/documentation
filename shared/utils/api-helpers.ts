import type { Doc } from "../types/doc";

export interface QueryParams {
  lang?: string;
  langs?: string[];
}

export interface DocsResponse {
  count: number;
  docs: Doc[];
  error?: string;
}

export interface DocWithTranslations extends Doc {
  translations?: { lang: string; path: string }[];
}

/**
 * Parse available languages from query.langs array
 * Each element is expected to be a JSON string like '{"code":"en"}'
 */
export function parseAvailableLangs(
  langs: string[] | undefined,
  currentLang: string | undefined
): string[] {
  if (!langs || !Array.isArray(langs)) {
    return [];
  }

  return langs
    .map((lang) => {
      try {
        const parsed = JSON.parse(lang);
        return parsed.code ?? null;
      } catch {
        return null;
      }
    })
    .filter((code): code is string => code !== null && code !== currentLang);
}

/**
 * Filter documents by language
 */
export function filterDocsByLang(docs: Doc[], lang: string): Doc[] {
  return docs.filter((doc) => doc._lang === lang);
}

/**
 * Add translations information to documents
 */
export function addTranslationsToDoc(
  doc: Doc,
  allDocs: Doc[],
  currentLang: string,
  availableLangs: string[]
): DocWithTranslations {
  const translations = availableLangs
    .map((lang) => {
      const translatedPath = doc._path.replace(`/${currentLang}/`, `/${lang}/`);
      const translatedDoc = allDocs.find(
        (d) => d._path === translatedPath && d._lang === lang
      );

      return translatedDoc ? { lang, path: translatedDoc._path } : null;
    })
    .filter((t): t is { lang: string; path: string } => t !== null);

  return {
    ...doc,
    translations,
  };
}

/**
 * Sort documents by category order, then file order, then title
 */
export function sortDocs<T extends Doc>(docs: T[]): T[] {
  return [...docs].sort((a, b) => {
    if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
    if (a.fileOrder !== b.fileOrder) return a.fileOrder - b.fileOrder;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Process docs with language filtering and translations
 */
export function processDocsWithQuery(
  docs: Doc[],
  query: QueryParams
): DocWithTranslations[] {
  const availableLangs = parseAvailableLangs(query.langs, query.lang);

  let filteredDocs: DocWithTranslations[] = docs;

  if (query.lang) {
    filteredDocs = filterDocsByLang(docs, query.lang);

    if (availableLangs.length > 0) {
      filteredDocs = filteredDocs.map((doc) =>
        addTranslationsToDoc(doc, docs, query.lang!, availableLangs)
      );
    }
  }

  return sortDocs(filteredDocs);
}
