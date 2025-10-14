<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Doc } from '#shared/types/doc'

interface Props {
  doc: Doc
}

defineProps<Props>()

const columns: TableColumn<{ key: string; value: unknown }>[] = [
  { accessorKey: 'key', header: 'Property' },
  { accessorKey: 'value', header: 'Value' }
]

function getBasicInfo (doc: Doc) {
  return [
    { key: 'ID', value: doc.id },
    { key: 'Title', value: doc.title },
    { key: 'Description', value: doc.description },
    { key: 'Extension', value: doc.extension },
    { key: 'Path', value: doc.path },
    { key: 'Stem', value: doc.stem },
    { key: 'Hash', value: doc.__hash__ }
  ]
}

function objectToArray (obj: Record<string, unknown>) {
  return Object.entries(obj).map(([key, value]) => ({ key, value }))
}
</script>

<template>
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
          :data="getBasicInfo(doc)"
          :columns="columns"
        />
      </div>

      <!-- SEO -->
      <div v-if="doc.seo">
        <h3 class="text-sm font-semibold text-highlighted mb-2">
          SEO
        </h3>
        <UTable 
          :data="objectToArray(doc.seo)"
          :columns="columns"
        />
      </div>

      <!-- Navigation -->
      <div v-if="doc.navigation">
        <h3 class="text-sm font-semibold text-highlighted mb-2">
          Navigation
        </h3>
        <UTable 
          :data="objectToArray(doc.navigation)"
          :columns="columns"
        />
      </div>

      <!-- Meta -->
      <div v-if="doc.meta && Object.keys(doc.meta).length > 0">
        <h3 class="text-sm font-semibold text-highlighted mb-2">
          Meta
        </h3>
        <UTable 
          :data="objectToArray(doc.meta)"
          :columns="columns"
        />
      </div>

      <!-- Full JSON object -->
      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-highlighted">
            Full JSON object
          </h3>
        </template>
        <pre class="text-xs overflow-auto max-h-96 bg-elevated p-4 rounded">{{ JSON.stringify(doc, null, 2) }}</pre>
      </UCard>
    </div>
  </UCard>
</template>
