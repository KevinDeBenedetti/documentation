<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
}

interface Props {
  links: TocLink[]
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div v-if="links.length" class="sticky top-20 space-y-4">
    <UCard>
      <template #header>
        <h3 class="text-sm font-semibold text-highlighted">
          {{ title || 'On this page' }}
        </h3>
      </template>
      
      <nav class="space-y-1">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="block text-sm text-muted hover:text-primary transition-colors py-1"
          :class="{
            'pl-0': link.depth === 2,
            'pl-4': link.depth === 3,
            'pl-8': link.depth === 4,
          }"
        >
          {{ link.text }}
        </a>
      </nav>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="text-sm font-semibold text-highlighted">
          Statistics
        </h3>
      </template>
      
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted">Sections</span>
          <span class="font-medium">{{ links.length }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
