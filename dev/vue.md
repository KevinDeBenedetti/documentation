# Vue 3

*Complete guide to Vue 3 with Composition API, TypeScript, routing and state management.*

## Install Vue 3

```bash
npm create vue@latest
```

## Composition API

The Composition API lets you group logic related to a specific feature, making maintenance and reuse easier.

### Script Setup

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>
```

## Syntax Rules and Conventions

### Component Naming

```vue
<!-- ✅ Good: PascalCase for components -->
<MyComponent />
<UserProfile />

<!-- ❌ Avoid: kebab-case in SFC templates -->
<my-component />
```

### Props and Events

```vue
<script setup lang="ts">
// Props: camelCase in the script
defineProps<{
  userId: number;
  isActive: boolean;
}>();

// Events: kebab-case is recommended
const emit = defineEmits<{
  "update:value": [value: string];
  "user-selected": [id: number];
}>();
</script>

<template>
  <!-- kebab-case in the template -->
  <ChildComponent
    :user-id="userId"
    :is-active="isActive"
    @update:value="handleUpdate"
    @user-selected="onUserSelected"
  />
</template>
```

### Component Options Order

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// 2. Props
const props = defineProps<{ id: string }>();

// 3. Emits
const emit = defineEmits<{ submit: [data: FormData] }>();

// 4. Composables
const router = useRouter();

// 5. State (ref, reactive)
const data = ref<Data | null>(null);

// 6. Computed
const isValid = computed(() => data.value !== null);

// 7. Methods
function handleSubmit() {
  // ...
}

// 8. Lifecycle hooks
onMounted(() => {
  // ...
});
</script>
```

## Composables

Composables are reusable functions that encapsulate stateful logic using the Composition API.

### Composable Structure

```typescript
// composables/useCounter.ts
import { ref, computed, readonly } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubleCount = computed(() => count.value * 2);

  function increment() { count.value++; }
  function decrement() { count.value--; }
  function reset() { count.value = initialValue; }

  return {
    count: readonly(count),
    doubleCount,
    increment,
    decrement,
    reset,
  };
}
```

### Fetch Composable

```typescript
// composables/useFetch.ts
import { ref, type Ref, unref } from "vue";

interface UseFetchOptions {
  immediate?: boolean;
}

export function useFetch<T>(url: Ref<string> | string, options: UseFetchOptions = {}) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function fetch() {
    loading.value = true;
    error.value = null;
    try {
      const response = await window.fetch(unref(url));
      if (!response.ok) throw new Error(response.statusText);
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  if (options.immediate !== false) {
    fetch();
  }

  return { data, error, loading, refetch: fetch };
}
```

## TypeScript with Vue 3

### Typing Props

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  tags: string[];
  user: {
    id: number;
    name: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});
</script>
```

### Typing Refs and Reactive

```typescript
import { ref, reactive } from "vue";

const count = ref<number>(0);
const user = ref<User | null>(null);

interface State {
  loading: boolean;
  data: User[];
}

const state = reactive<State>({
  loading: false,
  data: [],
});
```

### Typing Template Refs

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" type="text" />
</template>
```

## Vue Router

### Installation and Configuration

```bash
npm install vue-router@4
```

```typescript
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/users/:id",
    name: "user-detail",
    component: () => import("@/views/UserDetail.vue"),
    props: true,
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
```

### Usage in Components

```vue
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const userId = route.params.id;

function goToUser(id: number) {
  router.push({ name: "user-detail", params: { id } });
}

function search(term: string) {
  router.push({ name: "search", query: { q: term } });
}
</script>

<template>
  <RouterLink :to="{ name: 'home' }">Home</RouterLink>
  <RouterLink :to="`/users/${userId}`">Profile</RouterLink>
</template>
```

## Pinia — State Management

### Installation

```bash
npm install pinia
```

```typescript
// main.ts
import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());
```

### Create a Store

```typescript
// stores/user.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.name ?? "Guest");

  async function login(email: string, password: string) {
    try {
      const response = await api.post("/auth/login", { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem("token", token.value);
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  }

  return { user, token, isAuthenticated, userName, login, logout };
});
```

### Usage in Components

```vue
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();

// ✅ Good: use storeToRefs to keep reactivity
const { user, isAuthenticated } = storeToRefs(userStore);

// ✅ Actions can be destructured directly
const { login, logout } = userStore;

async function handleLogin() {
  await login("user@example.com", "password");
}
</script>
```

## Axios — HTTP Requests

### Installation and Configuration

```bash
npm install axios
```

```typescript
// services/api.ts
import axios, { type AxiosInstance } from "axios";
import { useUserStore } from "@/stores/user";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

### Typed API Service

```typescript
// services/userService.ts
import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>("/users");
    return data;
  },
  async getById(id: number): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
  async create(user: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>("/users", user);
    return data;
  },
  async update(id: number, user: Partial<User>): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, user);
    return data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
```

## Recommended Project Structure

```
src/
├── assets/          # Images, fonts, global styles
├── components/      # Reusable components
│   ├── ui/          # Base UI components (Button, Input, etc.)
│   └── features/    # Domain-specific components
├── composables/     # Reusable composable functions
├── layouts/         # Page layouts
├── router/          # Router configuration
├── services/        # API services
├── stores/          # Pinia stores
├── types/           # Shared TypeScript types
├── utils/           # Utility functions
├── views/           # Pages / Views
├── App.vue
└── main.ts
```

## Best Practices

- Use `<script setup>` with TypeScript
- Use `withDefaults` for default prop values
- Avoid direct prop mutations — use a local ref instead
- Use `defineExpose` sparingly — expose only what's necessary
- Lazy-load heavy or conditional components with `defineAsyncComponent`
