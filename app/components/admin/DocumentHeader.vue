<script setup lang="ts">
import type { Doc } from "#shared/types/doc";

interface Props {
  doc: Doc;
  currentLocale: string;
  locales: Array<{ code: string; name: string }>;
  availableTranslations: Array<{
    locale: string;
    localeName: string;
    doc: Doc;
  }>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "switch-language": [localeCode: string];
}>();

const languageItems = computed(() => {
  return props.locales.map((locale) => {
    const translation = props.availableTranslations?.find((t) => t.locale === locale.code);
    const isAvailable = !!translation;
    const isCurrent = locale.code === props.currentLocale;

    return {
      label: locale.name,
      icon: isCurrent ? "i-lucide-check" : "i-lucide-globe",
      disabled: !isAvailable,
      onSelect: () => emit("switch-language", locale.code),
      suffix: !isAvailable ? "(Non disponible)" : undefined,
    };
  });
});
</script>

<template>
  <div class="py-8 border-b border-default">
    <div class="flex items-start gap-4">
      <UIcon
        v-if="typeof doc.navigation === 'object' && doc.navigation.icon"
        :name="doc.navigation.icon"
        class="w-12 h-12 text-primary flex-shrink-0"
      />
      <div class="flex-1">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-highlighted mb-2">
              {{ doc.title }}
            </h1>
            <p v-if="doc.description" class="text-lg text-muted">
              {{ doc.description }}
            </p>
          </div>

          <UDropdownMenu :items="languageItems">
            <UButton
              color="neutral"
              variant="outline"
              :label="locales.find((l) => l.code === currentLocale)?.name"
              icon="i-lucide-globe"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
        </div>

        <slot name="metadata" />

        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
