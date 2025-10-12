import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import type { FrontmatterData, Doc } from '#shared/types/doc'
import { docIdToSlug } from '#shared/formatters/doc'

// FIXME : Get datas from YAML frontmatter in markdown files - title / description / seo
// if title or description are missing, use seo

export function parseFrontmatter (content: string): FrontmatterData {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match || !match[1]) {
    return {}
  }

  const frontmatterContent = match[1]
  const data: FrontmatterData = {}
  const lines = frontmatterContent.split('\n')
  
  let currentKey: string | null = null
  let currentValue: string = ''
  let inNestedObject = false
  
  const saveKeyValue = () => {
    if (currentKey && currentValue) {
      let value = currentValue.trim()
      
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1)
      }
      
      if (/^\d+$/.test(value)) {
        data[currentKey] = parseInt(value, 10)
      } else {
        data[currentKey] = value
      }
      
      currentKey = null
      currentValue = ''
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    
    if (!trimmed) continue
    
    if (trimmed.endsWith(':') && !trimmed.includes(' ')) {
      inNestedObject = true
      saveKeyValue()
      continue
    }
    
    if (inNestedObject && line.startsWith('  ')) {
      continue
    }
    
    if (inNestedObject && !line.startsWith('  ')) {
      inNestedObject = false
    }
    
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex !== -1 && !inNestedObject) {
      saveKeyValue()
      
      currentKey = trimmed.slice(0, colonIndex).trim()
      currentValue = trimmed.slice(colonIndex + 1).trim()
    }
  }
  
  saveKeyValue()
  
  return data
}

function extractOrderAndCleanPath (path: string): { cleanPath: string, categoryOrder: number, fileOrder: number, category: string, lang: string } {
  const parts = path.split('/').filter(Boolean)
  const cleanParts: string[] = []
  let categoryOrder = 999
  let fileOrder = 999
  let category = 'Autre'
  let lang = 'en'
  
  if (parts.length > 0) {
    lang = parts[0]
  }
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const match = part.match(/^(\d+)\.(.+)/)
    
    if (match) {
      const order = parseInt(match[1], 10)
      const cleanName = match[2]
      
      if (i === 1) {
        categoryOrder = order
        category = cleanName
      }

      if (i === parts.length - 1) {
        fileOrder = order
      }
      
      cleanParts.push(cleanName)
    } else {
      cleanParts.push(part)
    }
  }
  
  return {
    cleanPath: '/' + cleanParts.join('/'),
    categoryOrder,
    fileOrder,
    category,
    lang
  }
}

export async function getMarkdownFiles (dir: string, baseDir: string): Promise<Doc[]> {
  const files: Doc[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    
    if (entry.isDirectory()) {
      const subFiles = await getMarkdownFiles(fullPath, baseDir)
      files.push(...subFiles)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = await readFile(fullPath, 'utf-8')
      const data = parseFrontmatter(content)
      const relativePath = relative(baseDir, fullPath)
      const pathWithSlash = `/${relativePath.replace(/\.md$/, '').replace(/\\/g, '/')}`
      const id = `content${pathWithSlash}.md`
      const route = docIdToSlug(pathWithSlash)
      
      const { cleanPath, categoryOrder, fileOrder, category, lang } = extractOrderAndCleanPath(pathWithSlash)
      
      files.push({
        _dir: relative(baseDir, dir).replace(/\\/g, '/'),
        _id: id,
        _file: entry.name,
        _lang: lang,
        _path: cleanPath,
        _route: route,
        category,
        categoryOrder,
        fileOrder,
        title: data.title || entry.name.replace(/\.md$/, ''),
        description: data.description || '',
        order: data.order || fileOrder
      })
    }
  }

  return files
}
