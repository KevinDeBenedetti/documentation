<script setup lang="ts">
import type { Doc } from "#shared/types/doc";
import DocPreviewModal from "@/components/DocPreviewModal.vue";
import { docIdToSlug } from "#shared/formatters/doc";

interface Props {
  docs: Doc[];
  lang: string;
}

defineProps<Props>();

const overlay = useOverlay();

function openDocPreview(id: string, lang: string) {
  const modal = overlay.create(DocPreviewModal);
  modal.open({ id, lang });
}

const columns = [
  { accessorKey: "category", header: "Catégorie" },
  { accessorKey: "title", header: "Titre" },
  { accessorKey: "translationsCount", header: "Traductions" },
  { id: "actions", header: "Actions" },
  { id: "detail", header: "Détails" },
];
</script>

<template>
  <UTable ref="table" :data="docs" :columns="columns" sticky class="max-h-[600px]">
    <!-- Slot pour la colonne category -->
    <template #category-cell="{ row }">
      <UBadge variant="subtle" color="primary">
        {{ row.original.path }}
      </UBadge>
    </template>

    <!-- Slot pour la colonne title -->
    <template #title-cell="{ row }">
      {{ row.original.title }}
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
          @click="openDocPreview(row.original.id, lang)"
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
          @click="navigateTo(`/doc/${docIdToSlug(row.original.stem)}`)"
        />
      </div>
    </template>
  </UTable>
</template>
