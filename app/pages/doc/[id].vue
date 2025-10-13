<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { slugToDocId } from '#shared/formatters/doc'

const { defaultLocale } = useI18n()
const route = useRoute()
const lang = computed(() => (route.query.lang as string) ?? defaultLocale)

const formattedId = route.params.id as string

const id = slugToDocId(formattedId, lang.value)

const { data } = await useAsyncData(`doc-${formattedId}`, async () => {
  const collection = ('content_' + lang.value) as keyof Collections
  return queryCollection(collection).where('stem', '=', id).first()
})
</script>

<template>
  <UContainer v-if="data">
    <!-- Header with metadata -->
    <div class="py-8 border-b border-default">
      <div class="flex items-start gap-4">
        <UIcon 
          v-if="typeof data.navigation === 'object' && data.navigation.icon" 
          :name="data.navigation.icon" 
          class="w-12 h-12 text-primary flex-shrink-0"
        />
        <div class="flex-1">
          <h1 class="text-4xl font-bold text-highlighted mb-2">
            {{ data.title }}
          </h1>
          <p v-if="data.description" class="text-lg text-muted">
            {{ data.description }}
          </p>
          
          <!-- Additional metadata -->
          <div class="flex flex-wrap gap-2 mt-4">
            <UBadge v-if="data.extension" color="neutral" variant="subtle">
              {{ data.extension.toUpperCase() }}
            </UBadge>
            <UBadge v-if="data.path" color="primary" variant="subtle">
              {{ data.path }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Main layout with TOC sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-8">
      <!-- Main content -->
      <div class="min-w-0 space-y-8">
        <!-- Markdown content -->
        <ContentRenderer
          v-if="data.body"
          :value="data.body"
          class="prose prose-primary dark:prose-invert max-w-none"
        />

        <!-- Debug section: all information -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-highlighted">
              Document information
            </h2>
          </template>

          <div class="space-y-4">
            <!-- Basic information -->
            <div>
              <h3 class="text-sm font-semibold text-highlighted mb-2">
                Basic information
              </h3>
              <UTable 
                :data="[
                  { key: 'ID', value: data.id },
                  { key: 'Title', value: data.title },
                  { key: 'Description', value: data.description },
                  { key: 'Extension', value: data.extension },
                  { key: 'Path', value: data.path },
                  { key: 'Stem', value: data.stem },
                  { key: 'Hash', value: data.__hash__ },
                ]"
                :columns="[
                  { accessorKey: 'key', header: 'Property' },
                  { accessorKey: 'value', header: 'Value' }
                ]"
              />
            </div>

            <!-- SEO -->
            <div v-if="data.seo">
              <h3 class="text-sm font-semibold text-highlighted mb-2">
                SEO
              </h3>
              <UTable 
                :data="Object.entries(data.seo).map(([key, value]) => ({ key, value }))"
                :columns="[
                  { accessorKey: 'key', header: 'Property' },
                  { accessorKey: 'value', header: 'Value' }
                ]"
              />
            </div>

            <!-- Navigation -->
            <div v-if="data.navigation">
              <h3 class="text-sm font-semibold text-highlighted mb-2">
                Navigation
              </h3>
              <UTable 
                :data="Object.entries(data.navigation).map(([key, value]) => ({ key, value }))"
                :columns="[
                  { accessorKey: 'key', header: 'Property' },
                  { accessorKey: 'value', header: 'Value' }
                ]"
              />
            </div>

            <!-- Meta -->
            <div v-if="data.meta && Object.keys(data.meta).length > 0">
              <h3 class="text-sm font-semibold text-highlighted mb-2">
                Meta
              </h3>
              <UTable 
                :data="Object.entries(data.meta).map(([key, value]) => ({ key, value }))"
                :columns="[
                  { accessorKey: 'key', header: 'Property' },
                  { accessorKey: 'value', header: 'Value' }
                ]"
              />
            </div>

            <!-- Full JSON object (collapsed by default) -->
            <UCard>
              <template #header>
                <h3 class="text-sm font-semibold text-highlighted">
                  Full JSON object
                </h3>
              </template>
              <pre class="text-xs overflow-auto max-h-96 bg-elevated p-4 rounded">{{ JSON.stringify(data, null, 2) }}</pre>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Sidebar: Table of contents -->
      <aside class="hidden lg:block space-y-4">
        <!-- Table of contents -->
        <div v-if="data.body?.toc?.links?.length" class="sticky top-20 space-y-4">
          <UCard>
            <template #header>
              <h3 class="text-sm font-semibold text-highlighted">
                {{ data.body.toc.title || 'On this page' }}
              </h3>
            </template>
            
            <nav class="space-y-1">
              <a
                v-for="link in data.body.toc.links"
                :key="link.id"
                :href="`#${link.id}`"
                class="block text-sm text-muted hover:text-primary transition-colors py-1"
                :class="{
                  'pl-0': link.depth === 2,
                  'pl-4': link.depth === 3,
                  'pl-8': link.depth === 4,
                }"
              >
                {{ link.text }}
              </a>
            </nav>
          </UCard>

          <!-- Quick statistics -->
          <UCard>
            <template #header>
              <h3 class="text-sm font-semibold text-highlighted">
                Statistics
              </h3>
            </template>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted">Sections</span>
                <span class="font-medium">{{ data.body?.toc?.links?.length || 0 }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </aside>
    </div>

    <!-- Previous/next navigation -->
    <div class="border-t border-default pt-8 mt-8">
      <div class="flex justify-between items-center">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          label="Back"
          @click="$router.back()"
        />
      </div>
    </div>
  </UContainer>

  <!-- Loading or error state -->
  <UContainer v-else class="py-8">
    <UCard>
      <div class="text-center py-12">
        <UIcon name="i-lucide-file-question" class="w-16 h-16 mx-auto mb-4 text-muted" />
        <p class="text-muted">Document not found</p>
      </div>
    </UCard>
  </UContainer>
</template>