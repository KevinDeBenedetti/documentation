# Next.js

*Building modern full-stack React applications with Next.js App Router.*

## Overview

[Next.js](https://nextjs.org/) is a React framework that enables server-side rendering, static site generation, and full-stack development with a powerful App Router.

## Key Concepts

### App Router

The App Router is the recommended way to build Next.js applications. It uses **React Server Components** by default.

```tsx
// app/page.tsx — Server Component by default
export default function HomePage() {
  return <h1>Hello from a Server Component</h1>;
}
```

### Server vs Client Components

| Feature      | Server Component  | Client Component       |
| ------------ | ----------------- | ---------------------- |
| Default      | ✅ Yes             | ❌ Needs `"use client"` |
| Access to DB | ✅ Direct          | ❌ Via API              |
| Interactive  | ❌ No hooks/events | ✅ Full interactivity   |
| Bundle size  | ✅ Zero JS shipped | ⚠️ Included in bundle   |

### Data Fetching

Server Components can fetch data directly:

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // Static
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

## Routing

Next.js uses a **file-system based router**:

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[slug]/page.tsx` → `/blog/:slug`
- `app/docs/[...slug]/page.tsx` → `/docs/*`

### Layouts

Layouts wrap pages and persist across navigations:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Useful Commands

```bash
# Development
bun run dev

# Production build
bun run build

# Type checking
bun run type:check
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
