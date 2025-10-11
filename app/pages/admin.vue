<script setup lang="ts">
const { defaultLocale, locales } = useI18n()
const route = useRoute()
const lang = computed(() => (route.query.lang as string) ?? defaultLocale)

const { data } = await useFetch('/api/docs', {
  method: 'GET',
  query: {
    lang: lang.value,
    langs: locales
  }
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
            {{ data.count }} document(s) trouvé(s)
          </div>
        </div>

        <AdminDocsTable :docs="data.docs" />
      </div>
      
      <div v-else class="text-center py-12 text-muted">
        Aucune documentation disponible
      </div>
    </div>
  </UContainer>
</template>