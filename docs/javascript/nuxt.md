# Nuxt

*Complete guide to Nuxt 3: routing, composables, server API, middleware and best practices.*

Nuxt is an open-source web framework based on Vue.js that enables building performant, SEO-friendly web applications. It provides server-side rendering (SSR), static site generation (SSG), and much more.

## Why Choose Nuxt Instead of Vue?

### When to Use Nuxt

- **SEO optimization**: Marketing sites, blogs, e-commerce
- **Performance**: Fast initial load with SSR or SSG
- **Automatic routing**: File-based pages
- **Server-Side Rendering**: Pre-rendered content on the server
- **API routes**: Backend integrated directly within your project

### When to Use Vue Only

- **SPAs (Single Page Applications)**: Dashboards, internal apps
- **Apps requiring full flexibility**: Custom configuration
- **Applications not requiring SEO**: Internal tools, back-office
- **Rapid prototypes**: Simple projects without complex infra

### Vue vs Nuxt Comparison

| Criteria          | Vue                 | Nuxt                          |
| ----------------- | ------------------- | ----------------------------- |
| **Routing**       | Manual (Vue Router) | Automatic (file-based)        |
| **SEO**           | Limited (CSR)       | Excellent (SSR/SSG)           |
| **Performance**   | Slower (CSR)        | Faster (SSR/SSG)              |
| **Configuration** | Manual              | Convention over configuration |
| **Backend**       | Separate            | Built-in API routes           |
| **Complexity**    | Simpler             | More concepts                 |
| **Deployment**    | Classic SPA         | Requires Node.js or static    |

## Installing Nuxt 3

```bash
npx nuxi@latest init my-app
cd my-app
npm install
npm run dev
```

## Automatic Routing

### Pages and Routes

Nuxt generates routes automatically based on the `pages/` folder structure.

```
pages/
├── index.vue           → /
├── about.vue           → /about
├── users/
│   ├── index.vue       → /users
│   ├── [id].vue        → /users/:id
│   └── profile.vue     → /users/profile
└── blog/
    └── [slug].vue      → /blog/:slug
```

### Dynamic Page

```vue
<!-- pages/users/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const userId = route.params.id;

const { data: user } = await useFetch(`/api/users/${userId}`);
</script>

<template>
  <div>
    <h1>Profile of {{ user?.name }}</h1>
  </div>
</template>
```

### Catch-all Route

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug; // ['path', 'to', 'page']
</script>
```

## Navigation

### NuxtLink

```vue
<template>
  <NuxtLink to="/about">About</NuxtLink>
  <NuxtLink :to="`/users/${user.id}`">Profile</NuxtLink>
  <NuxtLink :to="{ name: 'users-id', params: { id: 1 } }">User 1</NuxtLink>
  <NuxtLink to="https://example.com" external>External site</NuxtLink>
  <NuxtLink to="/heavy-page" :prefetch="false">Heavy page</NuxtLink>
</template>
```

### Programmatic Navigation

```vue
<script setup lang="ts">
const router = useRouter();

function goToUser(id: number) {
  router.push(`/users/${id}`);
}

function goBack() {
  router.back();
}

async function navigateWithRedirect() {
  await navigateTo("/dashboard", { redirectCode: 301 });
}
</script>
```

## Layouts

### Default Layout

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>&copy; 2024 My Site</p>
    </footer>
  </div>
</template>
```

### Custom Admin Layout

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <!-- Admin sidebar -->
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>
```

### Using Layouts in Pages

```vue
<!-- pages/admin/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
</script>

<template>
  <div>
    <h1>Admin Dashboard</h1>
  </div>
</template>
```

## Nuxt Composables

### useFetch — Data Fetching

```vue
<script setup lang="ts">
interface User {
  id: number;
  name: string;
  email: string;
}

const { data: users, pending, error, refresh } = await useFetch<User[]>("/api/users");

const { data: user } = await useFetch<User>(`/api/users/${route.params.id}`, {
  key: `user-${route.params.id}`,
  lazy: true,
  server: true,
  watch: [() => route.params.id],
});
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
    <button @click="refresh()">Refresh</button>
  </div>
</template>
```

### useState — Shared State

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const count = useState("counter", () => 0);

  function increment() {
    count.value++;
  }

  return { count, increment };
};
```

### useHead — Meta Tags

```vue
<script setup lang="ts">
useHead({
  title: "My Page Title",
  meta: [
    { name: "description", content: "My page description" },
    { property: "og:title", content: "Open Graph title" },
  ],
  link: [{ rel: "canonical", href: "https://mysite.com/page" }],
});
</script>
```

### useCookie — Cookie Management

```typescript
export const useAuth = () => {
  const token = useCookie("auth-token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  function setToken(newToken: string) { token.value = newToken; }
  function clearToken() { token.value = null; }

  return { token, setToken, clearToken };
};
```

## Middleware

### Route Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { token } = useAuth();
  if (!token.value) {
    return navigateTo("/login");
  }
});
```

### Global Middleware

```typescript
// middleware/analytics.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Navigating to:", to.path);
});
```

### Inline Middleware

```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    "auth",
    function (to, from) {
      if (!hasPermission()) {
        return abortNavigation("Access denied");
      }
    },
  ],
});
</script>
```

## Server API Routes

### Simple API Route

```typescript
// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: "Hello World!" };
});
```

### Route with Parameters

```typescript
// server/api/users/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const user = await prisma.user.findUnique({ where: { id: parseInt(id!) } });

  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  return user;
});
```

### POST Route with Validation

```typescript
// server/api/users/index.post.ts
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = createUserSchema.parse(body);
  const user = await prisma.user.create({ data: validatedData });
  return user;
});
```

### Server Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth-token");
  if (event.path.startsWith("/api/admin") && !token) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }
});
```

## Plugins

### Simple Plugin

```typescript
// plugins/my-plugin.ts
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      hello: (name: string) => `Hello ${name}!`,
    },
  };
});
```

```vue
<!-- Usage -->
<script setup lang="ts">
const { $hello } = useNuxtApp();
console.log($hello("World")); // "Hello World!"
</script>
```

## Nuxt Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,

  app: {
    head: {
      title: "My Application",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:3000",
    },
  },

  imports: {
    dirs: ["composables/**", "utils/**"],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  modules: ["@nuxt/content", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
});
```

## Best Practices

1. **Prefer `useFetch` over `$fetch`** for page data — it's SSR-friendly with automatic caching
2. **Use keys for cache** — unique cache per ID avoids shared cache issues
3. **Prefer native composables** — use Nuxt composables like `useState` instead of manual `ref` for SSR
4. **Optimize images** — use `NuxtImg` for automatic format and size optimization
5. **Handle errors properly** — use `createError` for proper error pages
6. **Use custom error pages** — create `error.vue` for a better user experience

## Deployment

### SSR Mode (Node.js Server)

```bash
npm run build
node .output/server/index.mjs
```

### Static Mode (SSG)

```bash
npx nuxi generate
# Deploy the .output/public folder
```

### Recommended Platforms

- **Vercel**: SSR and SSG, automated deployment
- **Netlify**: Primarily SSG
- **Cloudflare Pages**: SSG and Workers for SSR
- **Railway**: SSR with Node.js
- **DigitalOcean**: SSR with Docker
