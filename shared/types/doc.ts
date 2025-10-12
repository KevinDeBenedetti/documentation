export interface FrontmatterData {
  title?: string
  description?: string
  order?: number
  [key: string]: string | number | boolean | undefined
}

interface Translation {
  lang: string
  path: string 
}

export interface Doc {
  _path: string
  _file: string
  _dir: string
  _id: string
  _lang: string
  _route: string
  category: string
  categoryOrder: number
  fileOrder: number
  title: string
  description: string
  order: number
  translations?: Translation[]
}

export type DocQuery = Partial<Doc>

export interface DocSortOptions {
  field: keyof Doc
  direction: 'asc' | 'desc'
}