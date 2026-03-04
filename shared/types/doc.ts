export interface FrontmatterData {
  title?: string;
  description?: string;
  order?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Structure of a table of contents item
 */
export interface TocLink {
  id: string;
  depth: number;
  text: string;
}

/**
 * Document table of contents
 */
export interface Toc {
  title: string;
  searchDepth: number;
  depth: number;
  links: TocLink[];
}

/**
 * Document body in minimark format
 * The minimark format is an array of tuples representing HTML elements
 */
export type MinimarkElement = [string, Record<string, unknown>, ...(string | MinimarkElement)[]];

/**
 * A minimark node can be a text string or an element tuple
 */
export type MinimarkNode = string | MinimarkElement;

/**
 * Document body
 */
export interface Body {
  type: "minimark";
  value: MinimarkNode[];
  toc: Toc;
}

/**
 * Navigation metadata
 */
export interface Navigation {
  icon?: string;
  [key: string]: unknown;
}

/**
 * SEO metadata
 */
export interface Seo {
  title: string;
  description: string;
  [key: string]: unknown;
}

/**
 * Document returned by Nuxt Content
 */
export interface Doc {
  // Common
  title: string;
  description: string;

  // Nuxt Content API properties (from queryCollection)
  id?: string;
  body?: Body;
  extension?: string;
  meta?: Record<string, unknown>;
  navigation?: Navigation;
  path?: string;
  seo?: Seo;
  stem?: string;
  __hash__?: string;

  // Parsed doc properties (from getMarkdownFiles / server API)
  _dir?: string;
  _id?: string;
  _file?: string;
  _lang?: string;
  _path?: string;
  _route?: string;
  category?: string;
  categoryOrder?: number;
  fileOrder?: number;
  order?: number;
}

export type DocQuery = Partial<Doc>;

export interface DocSortOptions {
  field: keyof Doc;
  direction: "asc" | "desc";
}
