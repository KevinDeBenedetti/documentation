<script setup lang="ts">
import { ContentRenderer } from '#components'

interface Props {
  path: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

// Utiliser queryCollection pour obtenir l'AST complet
const { data: docContent, status, error } = await useAsyncData(
  `doc-${props.path}`,
  async () => {
    console.log('🔍 Fetching document at path:', props.path)
    
    try {
      // Chercher le document par son chemin
      const result = await queryCollection('content')
        .path(props.path)
        .first()
      
      console.log('✅ Document found:', result)
      return result
    } catch (err) {
      console.error('❌ Error fetching document:', err)
      throw err
    }
  },
  {
    lazy: true,
    watch: [() => props.path]
  }
)

// Watchers pour débugger
watch(() => status.value, (newStatus) => {
  console.log('📊 Status changed to:', newStatus)
})

watch(() => docContent.value, (newContent) => {
  console.log('📄 Document content:', newContent)
  if (newContent) {
    console.log('📝 Body exists:', !!newContent.body)
    console.log('📋 Title:', newContent.title)
    console.log('🔗 Path:', newContent.path)
  }
})

watch(() => error.value, (newError) => {
  if (newError) {
    console.error('⚠️ Error occurred:', newError)
  }
})

// Calculer le titre à afficher
const displayTitle = computed(() => {
  if (docContent.value?.title) {
    return docContent.value.title
  }
  // Extraire le titre du chemin (dernier segment)
  const segments = props.path.split('/')
  return segments[segments.length - 1] || 'Document'
})
</script>

<template>
  <UModal
    :title="displayTitle"
    :close="{ onClick: () => emit('close') }"
    :ui="{ 
      content: 'max-w-4xl',
      body: 'prose prose-sm dark:prose-invert max-w-none'
    }"
  >
    <template #body>
      <!-- État de chargement -->
      <div v-if="status === 'pending'" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span class="ml-3 text-sm text-muted">Chargement du document...</span>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-error text-4xl mb-4">⚠️</div>
        <p class="text-error font-semibold mb-2">Erreur lors du chargement</p>
        <p class="text-sm text-muted mb-4">{{ error.message || error }}</p>
        <details class="text-left text-xs text-muted max-w-md mx-auto bg-elevated p-4 rounded">
          <summary class="cursor-pointer font-semibold mb-2">Détails techniques</summary>
          <pre class="mt-2 overflow-auto">{{ error }}</pre>
        </details>
      </div>

      <!-- Contenu trouvé et valide -->
      <ContentRenderer
        v-else-if="docContent?.body"
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
        
        <details class="text-left text-xs text-muted max-w-md mx-auto bg-elevated p-4 rounded">
          <summary class="cursor-pointer font-semibold mb-2">Informations de débogage</summary>
          <div class="mt-2 space-y-2">
            <div>
              <strong>Chemin demandé:</strong>
              <pre class="mt-1 p-2 bg-default rounded overflow-auto">{{ path }}</pre>
            </div>
            <div>
              <strong>Statut:</strong>
              <pre class="mt-1 p-2 bg-default rounded overflow-auto">{{ status }}</pre>
            </div>
            <div>
              <strong>Document reçu:</strong>
              <pre class="mt-1 p-2 bg-default rounded overflow-auto">{{ docContent || 'null' }}</pre>
            </div>
          </div>
        </details>
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
