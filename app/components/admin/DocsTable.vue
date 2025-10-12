<script setup lang="ts">
import type { Doc } from '#shared/types/doc'
import DocPreviewModal from '@/components/DocPreviewModal.vue'

interface Props {
  docs: Doc[]
}

const props = defineProps<Props>()

console.log('docs', props.docs)

const overlay = useOverlay()

function openDocPreview (path: string, lang: string, id: string) {
  const modal = overlay.create(DocPreviewModal)
  modal.open({ path, lang, id })
}

// Colonnes simplifiées sans renderers personnalisés
const columns = [
  { accessorKey: 'category', header: 'Catégorie' },
  { accessorKey: 'title', header: 'Titre' },
  { accessorKey: 'translationsCount', header: 'Traductions' },
  { id: 'actions', header: 'Actions' },
  { id: 'detail', header: 'Détails' }
]
</script>

<template>
  <UTable
    ref="table"
    :data="docs"
    :columns="columns"
    sticky
    class="max-h-[600px]"
  >
    <!-- Slot pour la colonne category -->
    <template #category-cell="{ row }">
      <UBadge variant="subtle" color="primary">
        {{ row.original.category }}
      </UBadge>
    </template>

    <!-- Slot pour la colonne title -->
    <template #title-cell="{ row }">
      {{ row.original.title }}
    </template>

    <!-- Slot pour la colonne translationsCount -->
    <template #translationsCount-cell="{ row }">
      <div v-if="row.original.translations?.length" class="flex items-center gap-2">
        <UBadge variant="subtle" color="success">
          {{ row.original.translations.length }}
        </UBadge>
        <UBadge
          v-for="t in row.original.translations"
          :key="t.lang"
          variant="outline"
          color="neutral"
          size="sm"
        >
          {{ t.lang.toUpperCase() }}
        </UBadge>
      </div>
    </template>

    <!-- Slot pour la colonne actions -->
    <template #actions-cell="{ row }">
      <div class="flex gap-2">
        <UButton
          label="Aperçu"
          color="neutral"
          variant="outline"
          icon="i-lucide-eye"
          size="sm"
          @click="openDocPreview(row.original._path, row.original._lang, row.original._id)"
        />
      </div>
    </template>

    <!-- Slot pour la colonne detail -->
    <template #detail-cell="{ row }">
      <div class="flex gap-2">
        <UButton
          label="Voir"
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-right"
          size="sm"
          @click="navigateTo(`/doc/${row.original._route}`)"
        />
      </div>
    </template>
  </UTable>
</template>