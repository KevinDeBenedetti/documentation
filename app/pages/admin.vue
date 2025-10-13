<script setup lang="ts">
import type { Doc } from '#shared/types/doc'
import type { Collections } from '@nuxt/content'

const { defaultLocale } = useI18n()
const route = useRoute()
const lang = computed(() => (route.query.lang as string) ?? defaultLocale)

const { data } = await useAsyncData(`doc-${lang.value}`, async () => {
  const collection = ('content_' + lang.value) as keyof Collections
  return queryCollection(collection).order('id', 'ASC').all()
})
</script>

<template>
  <UContainer>
    <div class="py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">
          Documentation Admin
        </h1>
      </div>

      <div v-if="data" class="space-y-4">
        <div class="flex items-center gap-4 px-4 py-3.5 border-b border-accented">
          <div class="ml-auto text-sm text-muted">
            {{ data.length }} document(s) trouvé(s)
          </div>
        </div>

        <AdminDocsTable :docs="data as Doc[]" :lang="lang" />
      </div>
      
      <div v-else class="text-center py-12 text-muted">
        Aucune documentation disponible
      </div>
    </div>
  </UContainer>
</template>