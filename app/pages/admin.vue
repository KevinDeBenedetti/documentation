<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

interface Doc {
  _path: string
  title: string
  description: string
  _file: string
  category: string
  categoryOrder: number
  fileOrder: number
  order: number
}

const route = useRoute()
const lang = computed(() => (route.query.lang as string) ?? 'fr')

const { data } = await useFetch(() => `/api/docs?lang=${encodeURIComponent(lang.value)}`)

const table = useTemplateRef('table')
const pathFilter = ref('')

// État de la modal
const overlay = useOverlay()
const DocPreviewModal = resolveComponent('DocPreviewModal')

function openDocPreview (path: string) {
  const modal = overlay.create(DocPreviewModal)
  modal.open({ path })
}

const columns: TableColumn<Doc>[] = [
  {
    accessorKey: 'categoryOrder',
    header: 'Ordre Cat.',
    cell: ({ row }) => row.original.categoryOrder,
    meta: {
      style: {
        td: { width: '8%' }
      }
    }
  },
  {
    accessorKey: 'fileOrder',
    header: 'Ordre',
    cell: ({ row }) => row.original.fileOrder,
    meta: {
      style: {
        td: { width: '7%' }
      }
    }
  },
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
        td: { maxWidth: '20%' }
      }
    }
  },
  {
    accessorKey: '_file',
    header: 'Fichier',
    cell: ({ row }) => row.getValue('_file'),
    meta: {
      style: {
        td: { width: '15%' }
      }
    }
  },
  {
    accessorKey: '_path',
    header: 'Chemin',
    cell: ({ row }) => h('code', { class: 'text-xs' }, row.original._path),
    meta: {
      style: {
        td: { width: '20%' }
      }
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h(UButton, {
        label: 'Aperçu',
        color: 'neutral',
        variant: 'outline',
        icon: 'i-lucide-eye',
        size: 'sm',
        onClick: () => openDocPreview(row.original._path)
      })
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
  <UContainer>
    <div class="py-8">
      <h1 class="text-3xl font-bold mb-6">
        Documentation Admin
      </h1>

      <div v-if="data?.docs" class="space-y-4">
        <div class="flex items-center gap-4 px-4 py-3.5 border-b border-accented">
          <UInput
            v-model="pathFilter"
            class="max-w-sm"
            placeholder="Filtrer par chemin..."
            icon="i-lucide-search"
            @input="table?.tableApi?.getColumn('_path')?.setFilterValue(pathFilter)"
          />
          
          <div class="text-sm text-muted">
            {{ data.docs.length }} document(s) trouvé(s)
          </div>
        </div>

        <UTable
          ref="table"
          :data="data.docs"
          :columns="columns"
          sticky
          class="max-h-[600px]"
        />
      </div>
      
      <div v-else class="text-center py-12 text-muted">
        Aucune documentation disponible
      </div>
    </div>
  </UContainer>
</template>