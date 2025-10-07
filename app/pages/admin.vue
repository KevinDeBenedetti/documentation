<script setup lang="ts">
const { data } = await useFetch('/api/test')

</script>

<template>
    <main class="max-w-4xl mx-auto">
        {{ data }}
    </main>
</template>