<script setup lang="ts">
import type { Doc } from "#shared/types/doc";

interface Props {
  translations: Array<{
    locale: string;
    localeName: string;
    doc: Doc;
  }>;
  currentLocale: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "switch-language": [localeCode: string];
}>();
</script>

<template>
  <UCard v-if="translations.length > 1">
    <template #header>
      <h2 class="text-xl font-semibold text-highlighted">Traductions disponibles</h2>
    </template>

    <div class="space-y-3">
      <div
        v-for="translation in translations"
        :key="translation.locale"
        class="flex items-center justify-between p-3 rounded-lg border border-default hover:bg-elevated transition-colors"
        :class="{ 'bg-elevated': translation.locale === currentLocale }"
      >
        <div class="flex items-center gap-3">
          <UIcon
            :name="
              translation.locale === currentLocale ? 'i-lucide-check-circle' : 'i-lucide-globe'
            "
            class="w-5 h-5"
            :class="translation.locale === currentLocale ? 'text-success' : 'text-muted'"
          />
          <div>
            <p class="font-medium">
              {{ translation.localeName }}
            </p>
            <p class="text-sm text-muted">
              {{ translation.doc.title }}
            </p>
          </div>
        </div>

        <UButton
          v-if="translation.locale !== currentLocale"
          color="neutral"
          variant="ghost"
          size="sm"
          label="Voir"
          @click="emit('switch-language', translation.locale)"
        />
        <UBadge v-else color="success" variant="subtle"> Actuelle </UBadge>
      </div>
    </div>
  </UCard>
</template>
