<script setup lang="ts">
const config = useRuntimeConfig() 
const dev = config.public.isAdmin
</script>

<template>
  <div v-if="dev">
    <UButton to="/admin" icon="i-lucide-rocket" size="md" color="neutral" variant="solid">Admin</UButton>
  </div>
</template>