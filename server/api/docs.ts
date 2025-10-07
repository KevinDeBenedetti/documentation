import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

interface FrontmatterData {
  title?: string
  description?: string
  order?: number
  [key: string]: string | number | undefined
}

interface DocFile {
  _path: string
  _file: string
  _dir: string
  category: string
  categoryOrder: number
  fileOrder: number
  title: string
  description: string
  order: number
}

function parseFrontmatter (content: string): FrontmatterData {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
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
      
      // Nettoyer les guillemets simples ou doubles
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1)
      }
      
      // Convertir en nombre si c'est un nombre
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
    
    // Ignorer les lignes vides
    if (!trimmed) continue
    
    // Détecter le début d'un objet imbriqué (on l'ignore)
    if (trimmed.endsWith(':') && !trimmed.includes(' ')) {
      inNestedObject = true
      saveKeyValue()
      continue
    }
    
    // Si on est dans un objet imbriqué et qu'on trouve une ligne indentée
    if (inNestedObject && line.startsWith('  ')) {
      continue
    }
    
    // Si on trouve une ligne non indentée après un objet, on sort de l'objet
    if (inNestedObject && !line.startsWith('  ')) {
      inNestedObject = false
    }
    
    // Ligne clé:valeur simple
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex !== -1 && !inNestedObject) {
      saveKeyValue()
      
      currentKey = trimmed.slice(0, colonIndex).trim()
      currentValue = trimmed.slice(colonIndex + 1).trim()
    }
  }
  
  // Sauvegarder la dernière paire clé-valeur
  saveKeyValue()
  
  return data
}

function extractOrderAndCleanPath (path: string): { cleanPath: string, categoryOrder: number, fileOrder: number, category: string } {
  // Exemple: /fr/1.devops/2.git.md -> /fr/devops/git
  const parts = path.split('/').filter(Boolean)
  const cleanParts: string[] = []
  let categoryOrder = 999
  let fileOrder = 999
  let category = 'Autre'
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const match = part.match(/^(\d+)\.(.+)/)
    
    if (match) {
      const order = parseInt(match[1], 10)
      const cleanName = match[2]
      
      // Le premier dossier avec un numéro est la catégorie
      if (i === 1) {
        categoryOrder = order
        category = cleanName
      }
      // Le dernier segment avec un numéro est le fichier
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
    category
  }
}

async function getMarkdownFiles (dir: string, baseDir: string): Promise<DocFile[]> {
  const files: DocFile[] = []
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
      
      const { cleanPath, categoryOrder, fileOrder, category } = extractOrderAndCleanPath(pathWithSlash)
      
      files.push({
        _path: cleanPath,
        _file: entry.name,
        _dir: relative(baseDir, dir).replace(/\\/g, '/'),
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = query.lang as string || 'en'
  
  const contentDir = join(process.cwd(), 'content', lang)
  
  try {
    const docs = await getMarkdownFiles(contentDir, join(process.cwd(), 'content'))
    
    docs.sort((a, b) => {
      // Tri par catégorie puis par ordre de fichier
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder
      if (a.fileOrder !== b.fileOrder) return a.fileOrder - b.fileOrder
      return a.title.localeCompare(b.title)
    })

    return {
      lang,
      count: docs.length,
      docs
    }
  } catch {
    return {
      lang,
      count: 0,
      docs: [],
      error: 'Directory not found'
    }
  }
})
