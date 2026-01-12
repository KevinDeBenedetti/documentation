---
applyTo: "**"
---

# Project Overview

This project is a multilingual documentation site built with Nuxt.js and Docus. It uses Nuxt Content for managing markdown files with MDC (Markdown Components) syntax, and Nuxt Studio for visual content editing.

## Technology Stack

- **Nuxt.js 4**: Meta-framework for Vue.js applications
- **Docus**: Documentation layer for Nuxt with pre-configured components
- **Nuxt Content**: File-based CMS for markdown content
- **Nuxt UI**: Component library for consistent UI elements
- **Nuxt Image**: Optimized image handling
- **Nuxt Script**: Script management
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS 4**: Utility-first CSS framework

## Folder Structure

- `/content`: Contains markdown files for documentation.
- `/nuxt.config.ts`: Contains the configuration for the Nuxt.js application.
- `/app/components`: Contains documentation for the project, including API specifications and user guides.
- `/shared/types`: Contains TypeScript type definitions shared between app and server.

## Libraries and Frameworks

- Nuxt.js for the frontend framework.
- Docus for documentation management.
- Nuxt Content for handling markdown files.
- Nuxt UI for UI components.
- Nuxt Image for image optimization.
- Nuxt Script for script management.
- Typescript for type safety.
- Tailwind CSS for styling.

## Coding Standards

- Use single quotes for strings.
- Use function based components in Vue & Nuxt.
- Use arrow functions for callbacks.

## UI guidelines

- Nuxt UI components should be used for consistency.
- Follow responsive design principles.
- Ensure accessibility standards are met.

## MDC (Markdown Components) Guidelines

- Use MDC syntax for all markdown files.
- Components should be named using PascalCase.
- Use hyphens to separate words in component names.
- Props should be in camelCase.
- Use `v-slot` for slot props.
- Always include a default export with the component's metadata.
- Use the `@` symbol to reference assets in the `static` directory.

## Documentation Guidelines

- Documentation should be written in markdown using MDC syntax.
- Use headings to define the structure and hierarchy.
- Include code examples for clarity.
- Use the `@` symbol to reference other documentation files.
- Keep documentation up-to-date with code changes.
- Review documentation for spelling and grammar errors.

## Metadata and Navigation Conventions

- Use frontmatter in markdown files for metadata.
- Define `title`, `description`, and `order` in frontmatter.
- Use `nav` property in frontmatter to define custom navigation.
- Use `sidebar` property in frontmatter to define sidebar content.
- Keep navigation structure consistent across documentation.
- Update navigation configuration in `nuxt.config.ts` as needed.

## TypeScript Guidelines

- All types should be properly documented with JSDoc comments.
- Use `export` for types that need to be shared between app and server.
- Place shared types in `/shared/types` directory.
- Use type imports with `import type` for better tree-shaking.
- Document complex types with examples in JSDoc.

### Using Shared Types

```typescript
// In app code
import type { DocFile, FrontmatterData } from "~/shared/types/doc";

// In server code
import type { DocFile } from "#shared/types/doc";
```
