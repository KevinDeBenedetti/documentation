<script setup lang="ts">
interface Props {
  path: string,
  lang: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const { data: docContent } = await useAsyncData(
  `doc-${props.path}`,
  async () => {
    console.log('🔍 Fetching document at path:', props.path)
    
    try {
      let doc = null
      console.log('Lang : ', props.lang)
      if (props.path === '/fr/index' || props.path === '/en/index') {
        doc = await queryCollection('content')
          .path(`/${props.lang}`)
          .first()
      } else {
        doc = await queryCollection('content')
          .path(props.path)
          .first()
      }
      console.log('✅ Document found:', doc)
      return doc
    } catch (err) {
      console.error('❌ Error fetching document:', err)
      return null
    }
  }
)

const shortDescription = computed(() => {
  const desc = docContent?.value?.description
  if (!desc || typeof desc !== 'string') return undefined

  const words = desc.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return undefined

  const truncated = words.slice(0, 10).join(' ')
  return words.length > 10 ? `${truncated}...` : truncated
})
</script>

<template>
  <UModal
    :title="docContent?.title"
    :description="shortDescription"
    :close="{ onClick: () => emit('close') }"
    :ui="{ 
      content: 'max-w-4xl',
      body: 'prose prose-sm dark:prose-invert max-w-none'
    }"
  >
    <template #body>
      <ContentRenderer
        v-if="docContent?.body"
        :value="docContent"
        class="markdown-content"
      />
      
      <!-- Pas de contenu -->
      <div v-else class="text-center py-12">
        <div class="text-muted text-4xl mb-4">📄</div>
        <p class="text-highlighted font-semibold mb-2">Document introuvable</p>
        <p class="text-sm text-muted mb-4">
          Le document <code class="px-2 py-1 bg-elevated rounded">{{ path }}</code> n'existe pas ou est vide.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Fermer"
          color="neutral"
          variant="outline"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>
