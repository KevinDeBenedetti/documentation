<script setup lang="ts">
const config = useRuntimeConfig();
const dev = config.public.isAdmin;
const route = useRoute();
const { defaultLocale } = useI18n();
const lang = computed(() => (route.query.lang as string) ?? defaultLocale);
</script>

<template>
  <div v-if="dev">
    <UButton
      :to="`/${lang}/admin`"
      icon="i-lucide-rocket"
      size="md"
      color="neutral"
      variant="solid"
    >
      Admin
    </UButton>
  </div>
</template>
