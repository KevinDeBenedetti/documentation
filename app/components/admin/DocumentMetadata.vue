<script setup lang="ts">
import type { Doc } from "#shared/types/doc";

interface Props {
  doc: Doc;
  translationsCount: number;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-wrap gap-2 mt-4">
    <UBadge v-if="doc.extension" color="neutral" variant="subtle">
      {{ doc.extension.toUpperCase() }}
    </UBadge>
    <UBadge v-if="doc.path" color="primary" variant="subtle">
      {{ doc.path }}
    </UBadge>
    <UBadge v-if="translationsCount > 0" color="success" variant="subtle">
      {{ translationsCount }} {{ translationsCount === 1 ? "traduction" : "traductions" }}
    </UBadge>
  </div>
</template>
