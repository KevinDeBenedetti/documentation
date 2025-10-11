<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Doc } from '#shared/types/doc'
import DocPreviewModal from '@/components/DocPreviewModal.vue'

interface Props {
  docs: Doc[],
}

defineProps<Props>()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const overlay = useOverlay()

function openDocPreview (path: string, lang: string, id: string) {
  const modal = overlay.create(DocPreviewModal)
  modal.open({ path, lang, id })
}

const columns: TableColumn<Doc>[] = [
  {
    accessorKey: 'category',
    header: 'Catégorie',
    cell: ({ row }) => {
      return h(UBadge, {
        variant: 'subtle',
        color: 'primary'
      }, () => row.original.category)
    },
    meta: {
      style: {
        td: { width: '15%' }
      }
    }
  },
  {
    accessorKey: 'title',
    header: 'Titre',
    cell: ({ row }) => row.getValue('title'),
    meta: {
      style: {
        td: { width: '30%' }
      }
    }
  },
  {
    accessorKey: 'translationsCount',
    header: 'Traductions',
    cell: ({ row }) => {
      const translations = row.original.translations || []
      
      if (translations.length === 0) {
        return null
      }
      
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UBadge, {
          variant: 'subtle',
          color: 'success'
        }, () => `${translations.length}`),
        ...translations.map((t) => 
          h(UBadge, {
            variant: 'outline',
            color: 'neutral',
            size: 'sm'
          }, () => t.lang.toUpperCase())
        )
      ])
    },
    meta: {
      style: {
        td: { width: '25%' }
      }
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          label: 'Aperçu',
          color: 'neutral',
          variant: 'outline',
          icon: 'i-lucide-eye',
          size: 'sm',
          onClick: () => openDocPreview(row.original._path, row.original._lang, row.original._id)
        })
      ])
    },
    meta: {
      style: {
        td: { width: '10%' }
      }
    }
  }
]
</script>

<template>
  <UTable
    ref="table"
    :data="docs"
    :columns="columns"
    sticky
    class="max-h-[600px]"
  />
</template>